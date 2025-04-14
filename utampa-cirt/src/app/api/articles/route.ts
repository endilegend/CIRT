import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
export const runtime = "nodejs";
const prisma = new PrismaClient();

export async function GET() {
  try {
    const articles = await prisma.article.findMany({
      include: {
        author: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(articles);
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { paper_name, type, keywords, author_id, pdf_path } = body;

    if (!paper_name || !type || !author_id || !pdf_path) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create the article with keywords
    const article = await prisma.article.create({
      data: {
        paper_name,
        type,
        author_id,
        pdf_path,
        status: "Sent",
        keywords: {
          create: keywords.map((keyword: string) => ({ keyword })),
        },
      },
      include: {
        keywords: true,
      },
    });

    return NextResponse.json({ article });
  } catch (error) {
    console.error("Error creating article:", error);
    return NextResponse.json(
      { error: "Failed to create article" },
      { status: 500 }
    );
  }
}
