import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // ✅ Test basic connection
    await prisma.$connect();

    // ✅ Query all tables concurrently
    const [user, article, review] = await Promise.all([
      prisma.user.findFirst(),
      prisma.article.findFirst(),
      prisma.review.findFirst(),
    ]);

    console.log("✅ DB Test Successful:", { user, article, review });

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
