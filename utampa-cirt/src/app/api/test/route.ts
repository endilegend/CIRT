import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

const prisma = new PrismaClient().$extends(withAccelerate());

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      where: {
        email: {
          contains: "alice@prisma.io",
        },
      },
      cacheStrategy: { ttl: 60 },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error querying users:", error);
    return NextResponse.json({ error: "Failed to run query" }, { status: 500 });
  }
}
