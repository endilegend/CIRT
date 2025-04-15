import { NextRequest, NextResponse } from "next/server";
import pdfParse from "pdf-parse/lib/pdf-parse.js";
import { createClient } from "@supabase/supabase-js";
export const runtime = "nodejs";
import { prisma } from "@/lib/prisma";

// Helper function to get file path from full URL
function getFilePathFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split("/");
    // Remove 'storage/v1/object/public/articles/' from the path
    const relevantPath = pathParts
      .slice(pathParts.indexOf("articles") + 1)
      .join("/");
    return relevantPath;
  } catch (e) {
    console.error("Error parsing URL:", e);
    return url;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log("Fetching PDF for article ID:", id);

    // First get the article to get the PDF path
    const article = await prisma.article.findUnique({
      where: { id: parseInt(id) },
    });

    if (!article) {
      console.error("Article not found for ID:", id);
      return NextResponse.json(
        { error: "Article not found" },
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (!article.pdf_path) {
      console.error("No PDF path found for article:", article.id);
      return NextResponse.json(
        { error: "No PDF file associated with this article" },
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Initialize Supabase client with service role key
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing Supabase environment variables");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });

    // Log the path for debugging
    console.log("PDF path from DB:", article.pdf_path);

    // Get just the filename from the full URL
    const filePath = getFilePathFromUrl(article.pdf_path);
    console.log("Extracted file path:", filePath);

    try {
      // Download the file from Supabase storage
      const { data, error } = await supabase.storage
        .from("articles")
        .download(filePath);

      if (error) {
        console.error("Error downloading from Supabase:", error);
        throw new Error(`Failed to download PDF: ${error.message}`);
      }

      if (!data) {
        console.error("No data received from Supabase");
        return NextResponse.json(
          { error: "PDF file not found in storage" },
          {
            status: 404,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      // Convert the blob to buffer
      const buffer = Buffer.from(await data.arrayBuffer());

      // Use pdf-parse with explicit options
      const options = {
        max: 0, // No page limit
        version: "default",
      };

      const pdfData = await pdfParse(buffer, options);

      if (!pdfData || !pdfData.text) {
        console.error("Failed to parse PDF content");
        return NextResponse.json(
          { error: "Failed to parse PDF content" },
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      return NextResponse.json(
        { content: pdfData.text },
        { headers: { "Content-Type": "application/json" } }
      );
    } catch (error) {
      console.error("Error reading PDF:", error);
      return NextResponse.json(
        {
          error: "Failed to read PDF file",
          details: error instanceof Error ? error.message : "Unknown error",
          path: article.pdf_path,
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
