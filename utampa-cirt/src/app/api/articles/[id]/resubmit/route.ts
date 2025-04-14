import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Status } from "@prisma/client";
import { adminAuth } from "@/lib/firebase-admin";
import { supabase } from "@/lib/supabase";

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

    const articleId = parseInt(params.id);
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

    // Convert the file to a Blob with the correct MIME type
    const blob = new Blob([await file.arrayBuffer()], {
      type: "application/pdf",
    });

    // Extract the filename from the current PDF path or create a new one
    const fileName =
      article.pdf_path.split("/").pop() || `${articleId}_${Date.now()}.pdf`;

    // Add a version parameter to the filename to prevent caching
    const versionedFileName = `${fileName.split(".")[0]}_v${Date.now()}.pdf`;

    // Upload the new file to Supabase storage, replacing the existing one
    const { error: uploadError } = await supabase.storage
      .from("articles")
      .upload(versionedFileName, blob, {
        upsert: true,
        contentType: "application/pdf",
        cacheControl: "no-cache, no-store, must-revalidate",
      });

    if (uploadError) {
      console.error("Error uploading file to Supabase:", uploadError);
      return NextResponse.json(
        { error: "Failed to upload file" },
        { status: 500 }
      );
    }

    // Get the public URL of the uploaded file with cache control
    const {
      data: { publicUrl },
    } = supabase.storage.from("articles").getPublicUrl(versionedFileName);

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
      { error: "Failed to resubmit article" },
      { status: 500 }
    );
  }
}
