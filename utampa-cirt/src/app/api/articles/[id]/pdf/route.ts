import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { readFile } from "fs/promises";
import { join } from "path";
import pdfParse from "pdf-parse/lib/pdf-parse.js";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // First get the article to get the PDF path
    const article = await prisma.article.findUnique({
      where: { id: parseInt(params.id) },
    });

    if (!article) {
      return NextResponse.json(
        { error: "Article not found" },
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (!article.pdf_path) {
      return NextResponse.json(
        { error: "No PDF file associated with this article" },
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Log the paths for debugging
    console.log("PDF path from DB:", article.pdf_path);

    // Clean up the path - remove any leading slashes and ensure we're looking in public/uploads
    const cleanPath = article.pdf_path.replace(/^\/?(public\/)?/, "");
    const absolutePath = join(process.cwd(), "public", cleanPath);

    console.log("Attempting to read from:", absolutePath);

    try {
      const dataBuffer = await readFile(absolutePath);

      // Use pdf-parse with explicit options
      const options = {
        max: 0, // No page limit
        version: "default",
      };

      const data = await pdfParse(dataBuffer, options);

      if (!data || !data.text) {
        return NextResponse.json(
          { error: "Failed to parse PDF content" },
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      return NextResponse.json(
        { content: data.text },
        { headers: { "Content-Type": "application/json" } }
      );
    } catch (error) {
      console.error("Error reading PDF:", error);
      return NextResponse.json(
        {
          error: "Failed to read PDF file",
          details: error instanceof Error ? error.message : "Unknown error",
          path: absolutePath,
          storedPath: article.pdf_path,
        },
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      {
        error: "Failed to process request",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
