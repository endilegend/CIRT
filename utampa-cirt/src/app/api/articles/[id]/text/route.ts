import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { readFile } from "fs/promises";
import { join } from "path";
import * as pdfjsLib from "pdfjs-dist";

const prisma = new PrismaClient();

// Initialize PDF.js worker with local worker file
pdfjsLib.GlobalWorkerOptions.workerSrc = join(
  process.cwd(),
  "node_modules",
  "pdfjs-dist",
  "build",
  "pdf.worker.min.js"
);

interface TextItem {
  str: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Ensure id is available
    if (!id) {
      return NextResponse.json(
        { error: "Article ID is required" },
        { status: 400 }
      );
    }

    const articleId = parseInt(id);

    if (isNaN(articleId)) {
      return NextResponse.json(
        { error: "Invalid article ID" },
        { status: 400 }
      );
    }

    // First get the article to get the PDF path
    const article = await prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    if (!article.pdf_path) {
      return NextResponse.json(
        { error: "No PDF file associated with this article" },
        { status: 404 }
      );
    }

    // Clean up the path - remove any leading slashes and ensure we're looking in public/uploads
    const cleanPath = article.pdf_path.replace(/^\/?(public\/)?/, "");
    const absolutePath = join(process.cwd(), "public", cleanPath);

    console.log("PDF path from DB:", article.pdf_path);
    console.log("Attempting to read from:", absolutePath);

    try {
      const dataBuffer = await readFile(absolutePath);
      const pdf = await pdfjsLib.getDocument({ data: dataBuffer }).promise;
      let text = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items
          .map((item) => ("str" in item ? item.str : ""))
          .join(" ");
        text += pageText + "\n\n";
      }

      return NextResponse.json({ text });
    } catch (error) {
      console.error("Error reading PDF:", error);
      return NextResponse.json(
        {
          error: "Failed to read PDF file",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      {
        error: "Failed to process request",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
