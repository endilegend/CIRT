import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    // Get the user ID from the URL parameters
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Fetch the user's recent publications
    const publications = await prisma.article.findMany({
      where: {
        author_id: userId,
      },
      include: {
        keywords: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5, // Limit to 5 most recent publications
    });

    return NextResponse.json({ publications });
  } catch (error) {
    console.error("Error fetching user publications:", error);
    return NextResponse.json(
      { error: "Failed to fetch publications" },
      { status: 500 }
    );
  }
}
