import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import pdfParse from "pdf-parse";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const article = await prisma.article.findUnique({
      where: { id: parseInt(params.id) },
    });

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    // Fetch the PDF content
    const response = await fetch(article.pdf_path);
    const arrayBuffer = await response.arrayBuffer();
    const pdfData = await pdfParse(Buffer.from(arrayBuffer));

    return NextResponse.json({ content: pdfData.text });
  } catch (error) {
    console.error("Error parsing PDF:", error);
    return NextResponse.json({ error: "Failed to parse PDF" }, { status: 500 });
  }
}
