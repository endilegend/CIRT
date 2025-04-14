import { NextResponse } from "next/server";
export const runtime = "nodejs";
import { prisma } from "@/lib/prisma";

// GET: Fetch featured articles
export async function GET() {
  try {
    const featuredArticles = await prisma.article.findMany({
      where: {
        featured: true,
        status: "Approved",
      },
      include: {
        author: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5, // Limit to 5 featured articles
    });

    return NextResponse.json({ articles: featuredArticles });
  } catch (error) {
    console.error("Error fetching featured articles:", error);
    return NextResponse.json(
      { error: "Failed to fetch featured articles" },
      { status: 500 }
    );
  }
}

// PUT: Update featured status of an article
export async function PUT(request: Request) {
  try {
    const { articleId, featured } = await request.json();

    if (typeof articleId !== "number" || typeof featured !== "boolean") {
      return NextResponse.json(
        { error: "Invalid request parameters" },
        { status: 400 }
      );
    }

    // If trying to feature an article, check if we've reached the limit
    if (featured) {
      const currentFeaturedCount = await prisma.article.count({
        where: {
          featured: true,
        },
      });

      if (currentFeaturedCount >= 6) {
        return NextResponse.json(
          { error: "Maximum of 6 featured articles reached" },
          { status: 400 }
        );
      }
    }

    const updatedArticle = await prisma.article.update({
      where: { id: articleId },
      data: { featured },
      include: {
        author: true,
      },
    });

    return NextResponse.json({ article: updatedArticle });
  } catch (error) {
    console.error("Error updating featured status:", error);
    return NextResponse.json(
      { error: "Failed to update featured status" },
      { status: 500 }
    );
  }
}
