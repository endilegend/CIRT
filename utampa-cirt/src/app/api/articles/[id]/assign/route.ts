import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await request.json();
    const articleId = parseInt(params.id);

    if (!userId || !articleId) {
      return NextResponse.json(
        { error: "User ID and Article ID are required" },
        { status: 400 }
      );
    }

    // Check if the user has the appropriate role (Editor or Reviewer)
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { user_role: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.user_role !== Role.Editor && user.user_role !== Role.Reviewer) {
      return NextResponse.json(
        {
          error:
            "Only Editors and Reviewers can be assigned to review articles",
        },
        { status: 403 }
      );
    }

    // Create a review record and update the article status
    const [review, updatedArticle] = await prisma.$transaction([
      // Create the review record
      prisma.review.create({
        data: {
          article_id: articleId,
          reviewerId: userId,
        },
      }),
      // Update the article status
      prisma.article.update({
        where: {
          id: articleId,
        },
        data: {
          status: "Under_Review",
        },
      }),
    ]);

    return NextResponse.json({
      article: updatedArticle,
      review: review,
    });
  } catch (error) {
    console.error("Error assigning reviewer:", error);
    return NextResponse.json(
      { error: "Failed to assign reviewer" },
      { status: 500 }
    );
  }
}
