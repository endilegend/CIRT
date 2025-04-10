import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Count all approved publications
    const count = await prisma.article.count({
      where: {
        status: "Approved",
      },
    });

    return NextResponse.json({ count });
  } catch (error) {
    console.error("Error fetching total publications count:", error);
    return NextResponse.json(
      { error: "Failed to fetch publications count" },
      { status: 500 }
    );
  }
}
