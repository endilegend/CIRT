import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Status } from "@prisma/client";
import { supabase } from "@/lib/supabase";
import { sendReviewStatusEmail } from "@/lib/email";
export const runtime = "nodejs";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ articleId: string }> }
) {
  try {
    const { articleId } = await params;
    const formData = await request.formData();
    const articleIdNum = parseInt(articleId);
    const reviewerId = formData.get("reviewerId") as string;
    const comments = formData.get("comments") as string;
    const status = formData.get("status") as Status;
    const file = formData.get("file") as File;

    if (!articleIdNum || !reviewerId || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get the current article to check its PDF path
    const currentArticle = await prisma.article.findUnique({
      where: { id: articleIdNum },
    });

    if (!currentArticle) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    let pdf_path = currentArticle.pdf_path;

    // If a file was uploaded, replace the existing one in Supabase storage
    if (file) {
      // Convert the file to a Blob with the correct MIME type
      const blob = new Blob([await file.arrayBuffer()], {
        type: "application/pdf",
      });

      // Extract the filename from the current PDF path or create a new one
      const fileName =
        currentArticle.pdf_path.split("/").pop() ||
        `${articleIdNum}_${Date.now()}.pdf`;

      // Add a version parameter to the filename to prevent caching
      const versionedFileName = `${fileName.split(".")[0]}_v${Date.now()}.pdf`;

      // Upload the new file to Supabase storage, replacing the existing one
      const { error: uploadError } = await supabase.storage
        .from("articles")
        .upload(versionedFileName, blob, {
          upsert: true,
          contentType: "application/pdf",
          cacheControl: "no-cache, no-store, must-revalidate",
        });

      if (uploadError) {
        console.error("Error uploading file to Supabase:", uploadError);
        return NextResponse.json(
          { error: "Failed to upload file" },
          { status: 500 }
        );
      }

      // Get the public URL of the uploaded file with cache control
      const {
        data: { publicUrl },
      } = supabase.storage.from("articles").getPublicUrl(versionedFileName);

      pdf_path = publicUrl;
    }

    // Start a transaction to update both the review and article
    const [review, article] = await prisma.$transaction([
      // Update or create the review
      prisma.review.upsert({
        where: {
          review_ID: await prisma.review
            .findFirst({
              where: {
                AND: [{ article_id: articleIdNum }, { reviewerId: reviewerId }],
              },
              select: { review_ID: true },
            })
            .then((r) => r?.review_ID ?? -1),
        },
        update: {
          comments: comments,
        },
        create: {
          article_id: articleIdNum,
          reviewerId: reviewerId,
          comments: comments,
        },
      }),
      // Update the article status and PDF path if provided
      prisma.article.update({
        where: {
          id: articleIdNum,
        },
        data: {
          status: status,
          ...(pdf_path ? { pdf_path: pdf_path } : {}),
        },
        include: {
          author: true,
        },
      }),
    ]);

    // Send email notification to the author if author exists
    if (article.author) {
      try {
        await sendReviewStatusEmail(
          article.author.email,
          article.paper_name,
          status,
          comments
        );
      } catch (error) {
        console.error("Error sending email notification:", error);
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({ review, article });
  } catch (error) {
    console.error("Error submitting review:", error);
    return NextResponse.json(
      { error: "Failed to submit review" },
      { status: 500 }
    );
  }
}
