import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const searchQuery = searchParams.get("search") || "";

    if (!searchQuery.trim()) {
      return NextResponse.json({ results: [] });
    }

    // Split the search query into individual terms
    const searchTerms = searchQuery.toLowerCase().split(/\s+/);

    const results = await prisma.article.findMany({
      where: {
        OR: [
          // Search in article title
          {
            paper_name: {
              contains: searchQuery,
              mode: "insensitive",
            },
          },
          // Search in author names
          {
            author: {
              OR: [
                {
                  f_name: {
                    contains: searchQuery,
                    mode: "insensitive",
                  },
                },
                {
                  l_name: {
                    contains: searchQuery,
                    mode: "insensitive",
                  },
                },
                // Search for full name
                {
                  AND: searchTerms.map((term) => ({
                    OR: [
                      { f_name: { contains: term, mode: "insensitive" } },
                      { l_name: { contains: term, mode: "insensitive" } },
                    ],
                  })),
                },
              ],
            },
          },
          // Search in keywords
          {
            keywords: {
              some: {
                keyword: {
                  contains: searchQuery,
                  mode: "insensitive",
                },
              },
            },
          },
        ],
      },
      include: {
        author: true,
        keywords: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Error performing search" },
      { status: 500 }
    );
  }
}
