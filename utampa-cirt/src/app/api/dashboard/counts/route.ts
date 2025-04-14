import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Status } from "@prisma/client";
import { adminAuth } from "@/lib/firebase-admin";
import { cookies } from "next/headers";
export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;

    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie);
    const userId = decodedClaims.uid;

    // Get the user's role
    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { user_role: true },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Count articles with status "Sent" for editors
    const editCount = await prisma.article.count({
      where: {
        status: Status.Sent,
      },
    });

    // Count articles with status "Under_Review" and assigned to the current user for reviewers
    const reviewCount = await prisma.review.count({
      where: {
        reviewerId: userId,
        article: {
          status: Status.Under_Review,
        },
      },
    });

    return NextResponse.json({
      editCount,
      reviewCount,
    });
  } catch (error) {
    console.error("Error fetching dashboard counts:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard counts" },
      { status: 500 }
    );
  }
}
