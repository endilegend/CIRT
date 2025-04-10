import { NextResponse } from "next/server";
import { PrismaClient, Status } from "@prisma/client";
import { writeFile } from "fs/promises";
import { join } from "path";

const prisma = new PrismaClient();

export async function POST(
  request: Request,
  { params }: { params: { articleId: string } }
) {
  try {
    const articleId = params.articleId;
    const formData = await request.formData();
    const articleIdNum = parseInt(articleId);
    const reviewerId = formData.get("reviewerId") as string;
    const comments = formData.get("comments") as string;
    const status = formData.get("status") as Status;
    const file = formData.get("file") as File;

    console.log("Received review submission:", {
      articleId,
      articleIdNum,
      reviewerId,
      status,
      hasFile: !!file,
      hasComments: !!comments,
    });

    if (!articleIdNum || !reviewerId || !status) {
      console.error("Missing required fields:", {
        articleIdNum,
        reviewerId,
        status,
      });
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // If a file was uploaded, save it
    let pdf_path = undefined;
    if (file) {
      try {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create a unique filename
        const timestamp = Date.now();
        const filename = `${articleIdNum}_${timestamp}.pdf`;
        const uploadDir = join(process.cwd(), "public/uploads");
        const filepath = join(uploadDir, filename);

        await writeFile(filepath, buffer);
        pdf_path = `uploads/${filename}`;
      } catch (error) {
        console.error("Error saving file:", error);
        return NextResponse.json(
          { error: "Failed to save uploaded file" },
          { status: 500 }
        );
      }
    }

    // Start a transaction to update both the review and article
    try {
      const [review, article] = await prisma.$transaction([
        // Update or create the review
        prisma.review.upsert({
          where: {
            review_ID: await prisma.review
              .findFirst({
                where: {
                  AND: [
                    { article_id: articleIdNum },
                    { reviewerId: reviewerId },
                  ],
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

      // Send email notification to the author
      if (article.author) {
        const statusMessage =
          {
            Sent: "has been sent for review",
            Under_Review: "is under review",
            Reviewed: "needs revision",
            Approved: "has been approved",
            Declined: "has been declined",
          }[status] || "has been updated";

        // Determine if we should send an email notification
        const shouldSendEmail = status !== article.status || comments;

        if (shouldSendEmail) {
          try {
            const emailResponse = await fetch(
              "http://localhost:3000/api/notifications/email",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  to: article.author.email,
                  subject: `Your article "${article.paper_name}" ${statusMessage}`,
                  html: `
                  <h2>Article Review Update</h2>
                  <p>Dear ${article.author.f_name} ${article.author.l_name},</p>
                  <p>Your article "${article.paper_name}" ${statusMessage}.</p>
                  ${comments ? `<p>Reviewer comments: ${comments}</p>` : ""}
                  <p>You can view the full review and take necessary actions by logging into your dashboard.</p>
                  <p>Best regards,<br>The CIRT Team</p>
                `,
                }),
              }
            );

            if (!emailResponse.ok) {
              console.error(
                "Failed to send email notification:",
                await emailResponse.text()
              );
            }
          } catch (emailError) {
            console.error("Error sending email notification:", emailError);
            // Don't fail the review submission if email fails
          }
        }
      }

      return NextResponse.json({
        success: true,
        review,
        article,
      });
    } catch (error) {
      console.error("Database transaction error:", error);
      // Check if the error is due to a missing article or review
      if (error instanceof Error && error.message.includes("RecordNotFound")) {
        return NextResponse.json(
          { error: "Article or review not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: "Failed to process review submission" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error submitting review:", error);
    return NextResponse.json(
      { error: "Failed to submit review" },
      { status: 500 }
    );
  }
}
