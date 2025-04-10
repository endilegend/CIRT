import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");

    if (!query) {
      return NextResponse.json({ users: [] });
    }

    const users = await prisma.user.findMany({
      where: {
        OR: [
          {
            f_name: {
              startsWith: query,
              mode: "insensitive",
            },
          },
          {
            l_name: {
              startsWith: query,
              mode: "insensitive",
            },
          },
        ],
      },
      select: {
        id: true,
        f_name: true,
        l_name: true,
        email: true,
      },
      take: 5, // Limit results to 5 users
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error searching users:", error);
    return NextResponse.json(
      { error: "Failed to search users" },
      { status: 500 }
    );
  }
}
