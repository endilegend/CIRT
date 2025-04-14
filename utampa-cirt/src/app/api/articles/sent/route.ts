import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const articles = await prisma.article.findMany({
      where: {
        status: "Sent",
      },
      include: {
        author: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json({ articles });
  } catch (error) {
    console.error("Error fetching sent articles:", error);
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}
