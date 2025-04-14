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
        where: {
          status: "Approved",
        },
        include: {
          author: true,
          keywords: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: limit,
        skip,
      }),
      prisma.article.count({
        where: {
          status: "Approved",
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    const response = NextResponse.json({
      articles,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit,
      },
    });

    // Add cache headers
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=60, stale-while-revalidate=30"
    );

    return response;
  } catch (error) {
    console.error("Error fetching approved articles:", error);
    return NextResponse.json(
      { error: "Failed to fetch approved articles" },
      { status: 500 }
    );
  }
}
