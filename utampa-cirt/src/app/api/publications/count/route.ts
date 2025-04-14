import { NextResponse } from "next/server";
export const runtime = "nodejs";
import { prisma } from "@/lib/prisma";

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
