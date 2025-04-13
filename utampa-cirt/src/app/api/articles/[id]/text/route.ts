import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import pdfParse from "pdf-parse/lib/pdf-parse.js";
import { supabase } from "@/lib/supabase";

const prisma = new PrismaClient();

// Helper function to get file path from full URL
function getFilePathFromUrl(url: string): string {
  try {
    // Extract the filename from the full URL
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split("/");
    return pathParts[pathParts.length - 1];
  } catch (e) {
    // If the URL parsing fails, assume it's just a filename
    return url;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const articleId = parseInt(params.id);
    if (isNaN(articleId)) {
      return NextResponse.json(
        { error: "Invalid article ID" },
        { status: 400 }
      );
    }

    console.log(`Processing text extraction for article ID: ${articleId}`);

    // Get the article from the database
    const article = await prisma.article.findUnique({
      where: { id: articleId },
      select: { pdf_path: true },
    });

    if (!article) {
      console.log("Article not found");
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    if (!article.pdf_path) {
      console.log("No PDF path found for article");
      return NextResponse.json(
        { error: "No PDF file associated with this article" },
        { status: 404 }
      );
    }

    console.log(`Fetching PDF from path: ${article.pdf_path}`);

    // Get just the filename from the full URL
    const filePath = getFilePathFromUrl(article.pdf_path);
    console.log("Extracted file path:", filePath);

    // Download the PDF from Supabase storage
    const { data, error } = await supabase.storage
      .from("articles")
      .download(filePath);

    if (error) {
      console.error("Error downloading PDF:", error);
      return NextResponse.json(
        { error: `Failed to download PDF: ${error.message}` },
        { status: 500 }
      );
    }

    if (!data) {
      console.log("No PDF data received");
      return NextResponse.json(
        { error: "No PDF data received from storage" },
        { status: 500 }
      );
    }

    console.log("PDF downloaded successfully, extracting text...");

    try {
      // Convert the blob to buffer
      const buffer = Buffer.from(await data.arrayBuffer());
      console.log(`PDF buffer size: ${buffer.length} bytes`);

      // Use pdf-parse with explicit options
      const options = {
        max: 0, // No page limit
        version: "default",
      };

      const pdfData = await pdfParse(buffer, options);

      if (!pdfData) {
        console.error("PDF parsing returned no data");
        return NextResponse.json(
          { error: "PDF parsing returned no data" },
          { status: 500 }
        );
      }

      if (!pdfData.text) {
        console.error("PDF contains no extractable text");
        return NextResponse.json(
          { error: "PDF contains no extractable text" },
          { status: 500 }
        );
      }

      console.log(
        `Text extraction completed. Extracted ${pdfData.text.length} characters`
      );
      return NextResponse.json({ text: pdfData.text });
    } catch (parseError) {
      console.error("Error parsing PDF:", parseError);
      return NextResponse.json(
        {
          error: `Failed to parse PDF: ${
            parseError instanceof Error ? parseError.message : "Unknown error"
          }`,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in text extraction:", error);
    return NextResponse.json(
      {
        error: `Failed to process request: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      },
      { status: 500 }
    );
  }
}
