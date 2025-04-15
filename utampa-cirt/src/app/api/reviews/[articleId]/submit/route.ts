import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Status } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";
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
      include: {
        author: true,
      },
    });

    if (!currentArticle) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    let pdf_path = currentArticle.pdf_path;

    // If a file was uploaded, replace the existing one in Supabase storage
    if (file) {
      // Initialize Supabase client with service role key
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

      if (!supabaseUrl || !supabaseServiceKey) {
        console.error("Missing Supabase environment variables");
        return NextResponse.json(
          { error: "Server configuration error" },
          { status: 500 }
        );
      }

      const supabase = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      });

      // Convert the file to a buffer
      const fileBuffer = Buffer.from(await file.arrayBuffer());

      // Extract the original file path from the current PDF path
      const originalPath = currentArticle.pdf_path
        .split("/storage/v1/object/public/articles/")
        .pop();
      if (!originalPath) {
        return NextResponse.json(
          { error: "Invalid file path format" },
          { status: 400 }
        );
      }

      // Upload the new file to Supabase storage, replacing the existing one
      const { error: uploadError } = await supabase.storage
        .from("articles")
        .upload(originalPath, fileBuffer, {
          upsert: true,
          contentType: "application/pdf",
          cacheControl: "3600",
        });

      if (uploadError) {
        console.error("Error uploading file to Supabase:", uploadError);
        return NextResponse.json(
          { error: "Failed to upload file", details: uploadError },
          { status: 500 }
        );
      }

      // Get the public URL of the uploaded file
      const {
        data: { publicUrl },
      } = supabase.storage.from("articles").getPublicUrl(originalPath);

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
      }),
    ]);

    // Send email notification to the author if author exists
    if (currentArticle.author) {
      try {
        await sendReviewStatusEmail(
          currentArticle.author.email,
          currentArticle.paper_name,
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
      {
        error: "Failed to submit review",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
