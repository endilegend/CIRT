import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // ✅ Test basic connection
    await prisma.$connect();

    // ✅ Try reading 1 row from each table
    const user = await prisma.user.findFirst();
    const article = await prisma.article.findFirst();
    const review = await prisma.review.findFirst();

    return NextResponse.json({
      success: true,
      user: user || "No users found",
      article: article || "No articles found",
      review: review || "No reviews found",
    });
  } catch (error) {
    console.error("❌ DB Test Error:", error);
    return NextResponse.json(
      {
        error: "Database test failed",
        details: error instanceof Error ? error.message : error,
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
