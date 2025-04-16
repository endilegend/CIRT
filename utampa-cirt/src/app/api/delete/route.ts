import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Optional: GET route for browser testing
export async function GET() {
  return NextResponse.json({
    message: "This route is working. Use POST to delete articles or users.",
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const articleIds: number[] | undefined = body.articleIds;
    const emails: string[] | undefined = body.emails;
    const deleteUserArticles: boolean = body.deleteUserArticles ?? false;

    // ✅ Delete by article IDs
    if (articleIds && Array.isArray(articleIds) && articleIds.length > 0) {
      await prisma.review.deleteMany({
        where: { article_id: { in: articleIds } },
      });
      await prisma.keyword.deleteMany({
        where: { article_id: { in: articleIds } },
      });
      await prisma.article.deleteMany({ where: { id: { in: articleIds } } });
    }

    // ✅ Delete by emails
    if (emails && Array.isArray(emails) && emails.length > 0) {
      const users = await prisma.user.findMany({
        where: { email: { in: emails } },
        select: { id: true },
      });

      const userIds = users.map((u) => u.id);

      if (userIds.length > 0) {
        if (deleteUserArticles) {
          // Get articles by these users
          const userArticles = await prisma.article.findMany({
            where: { author_id: { in: userIds } },
            select: { id: true },
          });

          const userArticleIds = userArticles.map((a) => a.id);

          await prisma.review.deleteMany({
            where: {
              OR: [
                { reviewerId: { in: userIds } },
                { article_id: { in: userArticleIds } },
              ],
            },
          });

          await prisma.keyword.deleteMany({
            where: { article_id: { in: userArticleIds } },
          });
          await prisma.article.deleteMany({
            where: { id: { in: userArticleIds } },
          });
        }
        await prisma.user.deleteMany({ where: { id: { in: userIds } } });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ API delete error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
