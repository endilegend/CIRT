import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  const users = await prisma.article.findMany();
  return Response.json(users);
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
