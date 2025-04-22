import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// This ensures the route runs on the Node.js runtime
export const runtime = "nodejs";

export async function GET() {
    try {
        const count = await prisma.article.count({
            where: { status: "Approved" },
        });

        if (count === 0) {
            return NextResponse.json({ error: "No articles available" }, { status: 404 });
        }

        const randomIndex = Math.floor(Math.random() * count);
        const [article] = await prisma.article.findMany({
            skip: randomIndex,
            take: 1,
            where: { status: "Approved" },
            include: {
                author: true,
                keywords: true,
            },
        });

        return NextResponse.json({ article });
    } catch (error) {
        console.error("Error fetching random article:", error);
        return NextResponse.json({ error: "Failed to fetch random article" }, { status: 500 });
    }
}
