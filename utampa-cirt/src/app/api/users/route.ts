import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export async function GET() {
  const users = await prisma.user.findMany();
  return Response.json(users);
}
