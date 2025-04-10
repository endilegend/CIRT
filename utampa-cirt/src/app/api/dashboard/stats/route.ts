import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getAuth } from "firebase/auth";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    // Get total articles assigned for review
    const assignedArticlesCount = await prisma.article.count({
      where: {
        status: "Under_Review",
      },
    });

    // Get total articles with status "Sent"
    const sentArticlesCount = await prisma.article.count({
      where: {
        status: "Sent",
      },
    });

    return NextResponse.json({
      assignedArticlesCount,
      sentArticlesCount,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard statistics" },
      { status: 500 }
    );
  }
}
