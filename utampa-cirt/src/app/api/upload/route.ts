import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import admin from "firebase-admin";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "@/lib/prisma";
import { ArticleType } from "@prisma/client";

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

export async function POST(request: NextRequest) {
  try {
    // Verify environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing Supabase environment variables");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Initialize Supabase client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });

    // Get Firebase token from Authorization header
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Missing or invalid authorization token" },
        { status: 401 }
      );
    }

    const token = authHeader.split("Bearer ")[1];

    // Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(token);
    const userId = decodedToken.uid;

    // Parse form data
    const formData = await request.formData();
    const uploadedFile = formData.get("file") as File;
    const paper_name = formData.get("name") as string;
    const type = formData.get("type") as ArticleType;
    const keywords = formData.get("keywords") as string;

    if (!uploadedFile || !paper_name || !type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate unique filename
    const fileExtension = uploadedFile.name.split(".").pop();
    const uniqueFilename = `${uuidv4()}.${fileExtension}`;
    const filePath = `${userId}/${uniqueFilename}`;

    // Convert file to buffer
    const fileArrayBuffer = await uploadedFile.arrayBuffer();
    const fileBuffer = Buffer.from(fileArrayBuffer);

    // Upload file to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("articles")
      .upload(filePath, fileBuffer, {
        contentType: "application/pdf",
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      return NextResponse.json(
        {
          error: "Failed to upload file to storage",
          details: uploadError.message,
        },
        { status: 500 }
      );
    }

    // Get the public URL for the uploaded file
    const {
      data: { publicUrl },
    } = supabase.storage.from("articles").getPublicUrl(filePath);

    // Create article record using Prisma
    try {
      const article = await prisma.article.create({
        data: {
          paper_name,
          type,
          author_id: userId,
          pdf_path: publicUrl,
          status: "Sent",
          keywords: {
            create: keywords.split(",").map((keyword) => ({
              keyword: keyword.trim(),
            })),
          },
        },
        include: {
          keywords: true,
        },
      });

      return NextResponse.json({ success: true, article });
    } catch (dbError) {
      console.error("Database insert error:", dbError);
      // If database insert fails, clean up the uploaded file
      await supabase.storage.from("articles").remove([filePath]);
      return NextResponse.json(
        {
          error: "Failed to save article details",
          details:
            dbError instanceof Error
              ? dbError.message
              : "Unknown database error",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Upload process error:", error);
    return NextResponse.json(
      {
        error: "Error processing upload",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
