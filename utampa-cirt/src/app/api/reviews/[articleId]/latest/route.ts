import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

    // Get the latest review for this article
    const review = await prisma.review.findFirst({
      where: {
        article_id: articleId,
      },
      orderBy: {
        review_date: "desc",
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
