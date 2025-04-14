import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
export const runtime = "nodejs";
const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = 3;

    const users = await prisma.user.findMany({
      where: {
        OR: [
          {
            f_name: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            l_name: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            email: {
              contains: query,
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
        user_role: true,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: {
        f_name: "asc",
      },
    });

    const total = await prisma.user.count({
      where: {
        OR: [
          {
            f_name: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            l_name: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            email: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
      },
    });

    return NextResponse.json({
      users,
      total,
      totalPages: Math.ceil(total / pageSize),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
