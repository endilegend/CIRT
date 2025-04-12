import { NextResponse } from "next/server";
import { PrismaClient, Status } from "@prisma/client";
import { writeFile } from "fs/promises";
import { join } from "path";
import { sendReviewStatusEmail } from "@/lib/email";

const prisma = new PrismaClient();

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

    // If a file was uploaded, save it
    let pdf_path = undefined;
    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Create a unique filename
      const timestamp = Date.now();
      const filename = `${articleIdNum}_${timestamp}.pdf`;
      const uploadDir = join(process.cwd(), "public/uploads");
      const filepath = join(uploadDir, filename);

      await writeFile(filepath, buffer);
      pdf_path = `uploads/${filename}`;
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
