import { NextResponse } from "next/server";
import { testConnection } from "@/lib/supabase";

export async function GET() {
  try {
    const result = await testConnection();
    if (!result.success) {
      return NextResponse.json(
        { error: "Database connection failed", details: result.error },
        { status: 500 }
      );
    }
    return NextResponse.json({ success: true, data: result.data });
  } catch (error) {
    console.error("Test connection error:", error);
    return NextResponse.json(
      { error: "Test connection failed", details: error },
      { status: 500 }
    );
  }
}
