import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
export const runtime = "nodejs";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { user_role } = await request.json();
    const { id: userId } = params;

    console.log("Received role:", user_role);

    // Validate required fields
    if (!userId || !user_role) {
      return NextResponse.json(
        { error: "User ID and role are required" },
        { status: 400 }
      );
    }

    // Convert the string role to the Role enum
    const roleEnum = Role[user_role as keyof typeof Role];

    if (!roleEnum) {
      return NextResponse.json(
        {
          error: `Invalid role value. Must be one of: ${Object.values(
            Role
          ).join(", ")}`,
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
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json(
      { error: "Failed to update user role" },
      { status: 500 }
    );
  }
}
