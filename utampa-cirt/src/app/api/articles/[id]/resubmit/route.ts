import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Status } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { writeFile } from "fs/promises";
import { join } from "path";

const prisma = new PrismaClient();

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getToken({ req: request });
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

    if (!article || article.author_id !== token) {
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

    // Save the new PDF file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a unique filename using timestamp
    const timestamp = Date.now();
    const filename = `${articleId}_${timestamp}.pdf`;
    const uploadDir = join(process.cwd(), "public/pdfs");
    const filepath = join(uploadDir, filename);

    await writeFile(filepath, buffer);
    const pdf_path = `/pdfs/${filename}`;

    // Update the article with new PDF and status
    const updatedArticle = await prisma.article.update({
      where: {
        id: articleId,
      },
      data: {
        pdf_path: pdf_path,
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
