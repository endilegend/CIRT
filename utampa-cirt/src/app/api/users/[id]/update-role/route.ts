import { NextResponse } from "next/server";
import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { user_role } = await request.json();
    const userId = params.id;

    console.log("Received role:", user_role);

    // Validate required fields
    if (!userId || !user_role) {
      return NextResponse.json(
        { error: "User ID and role are required" },
        { status: 400 }
      );
    }

    // Map string roles directly to Role enum values
    const roleMap = {
      Author: Role.Author,
      Reviewer: Role.Reviewer,
      Editor: Role.Editor,
    };

    const roleEnum = roleMap[user_role as keyof typeof roleMap];

    if (!roleEnum) {
      return NextResponse.json(
        {
          error: `Invalid role value. Must be one of: Author, Reviewer, Editor`,
        },
        { status: 400 }
      );
    }

    console.log("Converting to role enum:", roleEnum);

    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        user_role: roleEnum,
      },
      select: {
        id: true,
        f_name: true,
        l_name: true,
        email: true,
        user_role: true,
      },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json(
      { error: "Failed to update user role" },
      { status: 500 }
    );
  }
}
