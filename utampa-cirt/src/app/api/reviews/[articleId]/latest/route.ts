import { NextResponse } from "next/server";
export const runtime = "nodejs";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { articleId: string } }
) {
  try {
    const articleId = parseInt(await params.articleId);

    if (!articleId) {
      return NextResponse.json(
        { error: "Article ID is required" },
        { status: 400 }
      );
    }

    // Get the latest review for this article with reviewer information
    const review = await prisma.review.findFirst({
      where: {
        article_id: articleId,
      },
      include: {
        reviewer: true,
      },
      orderBy: {
        review_ID: "desc",
      },
    });

    if (!review) {
      return NextResponse.json({ error: "No review found" }, { status: 404 });
    }

    return NextResponse.json({ review });
  } catch (error) {
    console.error("Error fetching review:", error);
    return NextResponse.json(
      { error: "Failed to fetch review" },
      { status: 500 }
    );
  }
}
