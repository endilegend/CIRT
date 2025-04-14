import { adminAuth } from "./firebase-admin";
import { PrismaClient } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function sendReviewNotification(
  articleId: number,
  reviewerId: string,
  status: string,
  comments: string
) {
  try {
    // Get article and author details
    const article = await prisma.article.findUnique({
      where: { id: articleId },
      include: { author: true },
    });

    if (!article) {
      throw new Error("Article not found");
    }

    // Get reviewer details
    const reviewer = await prisma.user.findUnique({
      where: { id: reviewerId },
    });

    if (!reviewer) {
      throw new Error("Reviewer not found");
    }

    // Get author's email from Firebase
    const authorUser = await adminAuth.getUser(article.author_id);
    const authorEmail = authorUser.email;

    if (!authorEmail) {
      throw new Error("Author email not found");
    }

    // Send email using Firebase Admin SDK
    await adminAuth.generateEmailVerificationLink(authorEmail, {
      url: `${process.env.NEXT_PUBLIC_APP_URL}/article/${articleId}`,
    });

    // Note: In a production environment, you would use a proper email service
    // like SendGrid, Mailgun, or AWS SES to send the actual email.
    // This is just a placeholder to show where the email would be sent.
    console.log("Email notification would be sent to:", authorEmail);
    console.log("Subject: Article Review Update");
    console.log("Body:", {
      articleTitle: article.paper_name,
      reviewerName: `${reviewer.f_name} ${reviewer.l_name}`,
      status,
      comments,
    });

    return true;
  } catch (error) {
    console.error("Error sending review notification:", error);
    return false;
  }
}
