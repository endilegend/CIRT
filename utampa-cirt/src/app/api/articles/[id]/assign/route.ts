import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await request.json();
    const articleId = params.id;

    if (!userId || !articleId) {
      return NextResponse.json(
        { error: "User ID and Article ID are required" },
        { status: 400 }
      );
    }

    // Update the article with the assigned editor and change status to "Under Review"
    const updatedArticle = await prisma.article.update({
      where: {
        id: articleId,
      },
      data: {
        status: "Under Review",
        reviewer_id: userId,
      },
    });

    return NextResponse.json({ article: updatedArticle });
  } catch (error) {
    console.error("Error assigning editor:", error);
    return NextResponse.json(
      { error: "Failed to assign editor" },
      { status: 500 }
    );
  }
}
