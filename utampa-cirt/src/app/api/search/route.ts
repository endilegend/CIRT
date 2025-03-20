import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  // Parse the search query parameter from the URL (e.g., ?search=foo)
  const { search = "" } = Object.fromEntries(
    new URL(req.url).searchParams.entries()
  );

  try {
    const articles = await prisma.article.findMany({
      where: {
        OR: [
          // Match on paper_name
          { paper_name: { contains: search, mode: "insensitive" } },
          // Match on any associated keyword
          {
            keywords: {
              some: { keyword: { contains: search, mode: "insensitive" } },
            },
          },
          // Match on author's first name, last name, or email
          {
            author: {
              OR: [
                { f_name: { contains: search, mode: "insensitive" } },
                { l_name: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
              ],
            },
          },
        ],
      },
      include: { keywords: true, author: true },
    });

    return NextResponse.json({ results: articles });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "Search error" }, { status: 500 });
  }
}
