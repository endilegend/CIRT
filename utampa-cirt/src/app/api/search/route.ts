import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Status } from "@prisma/client";
export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawQuery = searchParams.get("search") || "";
    const status = (searchParams.get("status") as Status) || Status.Approved;
    const type = searchParams.get("type") || "";
    const year = searchParams.get("year") || "";

    // Helper: build OR condition across title, author, and keywords
    const buildFieldOR = (term: string) => ({
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

    // Basic parser for AND / OR (can be expanded later with nested logic)
    let searchCondition = {};
    const hasOr = /\s+OR\s+/i.test(rawQuery);
    const hasAnd = /\s+AND\s+/i.test(rawQuery);

    if (hasOr) {
      const terms = rawQuery.split(/\s+OR\s+/i);
      searchCondition = {
        OR: terms.map((term) => buildFieldOR(term.trim())),
      };
    } else if (hasAnd) {
      const terms = rawQuery.split(/\s+AND\s+/i);
      searchCondition = {
        AND: terms.map((term) => buildFieldOR(term.trim())),
      };
    } else if (rawQuery.trim()) {
      searchCondition = buildFieldOR(rawQuery.trim());
    }

    // Year filter
    let yearCondition = {};
    if (year) {
      if (year === "older") {
        yearCondition = {
          createdAt: {
            lt: new Date("2022-01-01"),
          },
        };
      } else {
        const yearNum = parseInt(year);
        if (!isNaN(yearNum)) {
          yearCondition = {
            createdAt: {
              gte: new Date(`${year}-01-01`),
              lt: new Date(`${year + 1}-01-01`),
            },
          };
        }
      }
    }

    // Type filter
    let typeCondition = {};
    if (type) {
      typeCondition = {
        type: {
          equals: type,
        },
      };
    }

    const articles = await prisma.article.findMany({
      where: {
        AND: [
          { status },
          searchCondition,
          typeCondition,
          yearCondition,
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

    return NextResponse.json({ results: articles });
  } catch (error) {
    console.error("Error searching articles:", error);
    return NextResponse.json(
        { error: "Failed to search articles" },
        { status: 500 }
    );
  }
}
