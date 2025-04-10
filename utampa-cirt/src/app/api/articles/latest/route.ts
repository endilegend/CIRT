import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const articles = await prisma.article.findMany({
      take: 10, // Get the 10 most recent articles
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: true,
        keywords: true,
      },
    });

    return NextResponse.json({ articles });
  } catch (error) {
    console.error("Error fetching latest articles:", error);
    return NextResponse.json(
      { error: "Failed to fetch latest articles" },
      { status: 500 }
    );
  }
}
