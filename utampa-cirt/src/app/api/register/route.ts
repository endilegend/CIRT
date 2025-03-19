import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { uid, email, fName, lName } = body;

    // Save user to MySQL using Prisma
    const newUser = await prisma.user.create({
      data: {
        id: uid,
        email: email,
        f_name: fName,
        l_name: lName,
        user_role: "Author", // Default role
      },
    });

    return NextResponse.json(
      { message: "User registered successfully", user: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving user:", error);
    return NextResponse.json({ error: "Failed to save user" }, { status: 500 });
  }
}
