import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
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

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const authorId = formData.get("authorId") as string;

    if (!file || !authorId) {
      return NextResponse.json(
        { error: "File and author ID are required" },
        { status: 400 }
      );
    }

    // Verify the article belongs to the author
    const article = await prisma.article.findUnique({
      where: { id: parseInt(params.id) },
    });

    if (!article || article.author_id !== authorId) {
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

    // Save the file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `${Date.now()}-${file.name}`;
    const path = join(process.cwd(), "public/uploads", fileName);
    await writeFile(path, buffer);

    // Update the article
    const updatedArticle = await prisma.article.update({
      where: { id: parseInt(params.id) },
      data: {
        pdf_path: `/uploads/${fileName}`,
        status: "Under_Review",
      },
    });

    return NextResponse.json({ article: updatedArticle });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to resubmit article" },
      { status: 500 }
    );
  }
}
