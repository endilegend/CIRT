import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
export const runtime = "nodejs";
const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 9;
    const skip = (page - 1) * limit;

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        take: limit,
        skip,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          author: true,
          keywords: true,
        },
      }),
      prisma.article.count(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      articles,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit,
      },
    });
  } catch (error) {
    console.error("Error fetching latest articles:", error);
    return NextResponse.json(
      { error: "Failed to fetch latest articles" },
      { status: 500 }
    );
  }
}
