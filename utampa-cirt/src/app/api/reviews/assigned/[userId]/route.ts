import { NextResponse } from "next/server";
export const runtime = "nodejs";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userId = url.pathname.split("/").pop();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Get all reviews assigned to this user, including the article and its author
    const reviews = await prisma.review.findMany({
      where: {
        reviewerId: userId,
        article: {
          status: {
            not: "Approved",
          },
        },
      },
      include: {
        article: {
          include: {
            author: true,
          },
        },
      },
    });

    // Extract the articles from the reviews
    const articles = reviews.map((review) => review.article);

    return NextResponse.json({ articles });
  } catch (error) {
    console.error("Error fetching assigned articles:", error);
    return NextResponse.json(
      { error: "Failed to fetch assigned articles" },
      { status: 500 }
    );
  }
}
