import { NextResponse } from "next/server";
import { PrismaClient, Status } from "@prisma/client";
export const runtime = "nodejs";
const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get("search") || "";
    const status = (searchParams.get("status") as Status) || Status.Approved;

    const articles = await prisma.article.findMany({
      where: {
        AND: [
          {
            OR: [
              { paper_name: { contains: searchQuery, mode: "insensitive" } },
              {
                author: {
                  OR: [
                    { f_name: { contains: searchQuery, mode: "insensitive" } },
                    { l_name: { contains: searchQuery, mode: "insensitive" } },
                  ],
                },
              },
              {
                keywords: {
                  some: {
                    keyword: { contains: searchQuery, mode: "insensitive" },
                  },
                },
              },
            ],
          },
          { status },
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
