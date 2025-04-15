import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Status } from "@prisma/client";
import { adminAuth } from "@/lib/firebase-admin";
import { createClient } from "@supabase/supabase-js";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify Firebase token using the initialized adminAuth
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;

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

    const { id } = params;
    const articleId = parseInt(id);
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const status = formData.get("status") as Status;

    if (!file || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify the article belongs to the author
    const article = await prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!article || article.author_id !== userId) {
      return NextResponse.json(
        { error: "Article not found or unauthorized" },
        { status: 404 }
      );
    }

    if (article.status !== "Reviewed") {
      return NextResponse.json(
        { error: "Article must be in Reviewed status to resubmit" },
        { status: 400 }
      );
    }

    // Convert the file to a buffer
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Extract the original file path from the current PDF path
    const originalPath = article.pdf_path
      .split("/storage/v1/object/public/articles/")
      .pop();
    if (!originalPath) {
      return NextResponse.json(
        { error: "Invalid file path format" },
        { status: 400 }
      );
    }

    // Upload the new file to Supabase storage, replacing the existing one
    const { error: uploadError } = await supabase.storage
      .from("articles")
      .upload(originalPath, fileBuffer, {
        upsert: true,
        contentType: "application/pdf",
        cacheControl: "3600",
      });

    if (uploadError) {
      console.error("Error uploading file to Supabase:", uploadError);
      return NextResponse.json(
        { error: "Failed to upload file", details: uploadError },
        { status: 500 }
      );
    }

    // Get the public URL of the uploaded file
    const {
      data: { publicUrl },
    } = supabase.storage.from("articles").getPublicUrl(originalPath);

    // Update the article with new PDF and status
    const updatedArticle = await prisma.article.update({
      where: {
        id: articleId,
      },
      data: {
        pdf_path: publicUrl,
        status: status,
      },
    });

    return NextResponse.json({ article: updatedArticle });
  } catch (error) {
    console.error("Error resubmitting article:", error);
    return NextResponse.json(
      {
        error: "Failed to resubmit article",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
