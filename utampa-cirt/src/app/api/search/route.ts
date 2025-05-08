import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Status, Prisma, ArticleType } from "@prisma/client";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawQuery = searchParams.get("search") || "";
    const status = (searchParams.get("status") as Status) || Status.Approved;
    const type = searchParams.get("type") || "";
    const year = searchParams.get("year") || "";
    const operator = searchParams.get("operator") || "AND";

    console.log("Search parameters:", {
      rawQuery,
      status,
      type,
      year,
      operator,
    });

    // Helper: build search condition for a single term
    const buildSearchCondition = (term: string): Prisma.ArticleWhereInput => ({
      OR: [
        { paper_name: { contains: term, mode: "insensitive" } },
        {
          author: {
            OR: [
              { f_name: { contains: term, mode: "insensitive" } },
              { l_name: { contains: term, mode: "insensitive" } },
            ],
          },
        },
        {
          keywords: {
            some: {
              keyword: { contains: term, mode: "insensitive" },
            },
          },
        },
      ],
    });

    // Build search conditions based on operator
    let searchCondition: Prisma.ArticleWhereInput = {};
    if (rawQuery.trim()) {
      const terms = rawQuery
        .trim()
        .split(/\s+/)
        .filter((term) => term.length > 0);

      if (terms.length > 0) {
        const termConditions = terms.map((term) => buildSearchCondition(term));
        if (termConditions.length > 0) {
          searchCondition =
            operator === "AND"
              ? { AND: termConditions }
              : { OR: termConditions };
        }
      }
    }

    // Year filter
    let yearCondition: Prisma.ArticleWhereInput = {};
    if (year) {
      const currentYear = new Date().getFullYear();

      if (year === "older") {
        // For "older" option, get articles from before the previous year
        const cutoffDate = new Date(currentYear - 1, 0, 1);
        yearCondition = {
          createdAt: {
            lt: cutoffDate,
          },
        };
      } else {
        const yearNum = parseInt(year);
        if (!isNaN(yearNum)) {
          const startDate = new Date(yearNum, 0, 1); // January 1st of the year
          const endDate = new Date(yearNum + 1, 0, 1); // January 1st of next year

          yearCondition = {
            createdAt: {
              gte: startDate,
              lt: endDate,
            },
          };
        }
      }
    }

    // Type filter
    let typeCondition: Prisma.ArticleWhereInput = {};
    if (type) {
      typeCondition = {
        type: {
          equals: type as ArticleType,
        },
      };
    }

    // Build the where condition
    const conditions: Prisma.ArticleWhereInput[] = [{ status }];

    if (Object.keys(searchCondition).length > 0) {
      conditions.push(searchCondition);
    }

    if (Object.keys(typeCondition).length > 0) {
      conditions.push(typeCondition);
    }

    if (Object.keys(yearCondition).length > 0) {
      conditions.push(yearCondition);
    }

    const whereCondition: Prisma.ArticleWhereInput = {
      AND: conditions,
    };

    console.log("Where condition:", JSON.stringify(whereCondition, null, 2));

    try {
      const articles = await prisma.article.findMany({
        where: whereCondition,
        include: {
          author: true,
          keywords: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      console.log(`Found ${articles.length} articles`);
      return NextResponse.json({ results: articles });
    } catch (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json(
        {
          error: "Database query failed",
          details: dbError instanceof Error ? dbError.message : "Unknown error",
          query: whereCondition,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error searching articles:", error);
    return NextResponse.json(
      {
        error: "Failed to search articles",
        details: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
