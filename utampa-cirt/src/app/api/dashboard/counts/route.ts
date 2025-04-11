import { NextResponse } from "next/server";
import { PrismaClient, Status } from "@prisma/client";
import { getAuth } from "firebase/auth";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the user's role
    const dbUser = await prisma.user.findUnique({
      where: { id: user.uid },
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
        reviewerId: user.uid,
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
