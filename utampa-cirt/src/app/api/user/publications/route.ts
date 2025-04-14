import { NextResponse } from "next/server";
export const runtime = "nodejs";
import { prisma } from "@/lib/prisma";

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

    // Fetch all user publications
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
