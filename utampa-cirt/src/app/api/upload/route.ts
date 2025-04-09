import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import formidable, { File, Fields, Files } from "formidable";
import { Readable } from "stream";
import { IncomingMessage } from "http";

export const runtime = "nodejs";

export const config = {
  api: {
    bodyParser: false,
  },
};

const prisma = new PrismaClient();
const uploadDir = path.join(process.cwd(), "public", "pdfs");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export async function POST(req: Request) {
  // 1) Read the entire request body into an ArrayBuffer
  const reqBuffer = await req.arrayBuffer();

  // 2) Convert that ArrayBuffer into a Node.js Readable stream
  const nodeStream = new Readable();
  nodeStream.push(Buffer.from(reqBuffer));
  nodeStream.push(null);

  // 3) Create a plain headers object from the Next.js Request headers
  const headers = Object.fromEntries(req.headers.entries());

  // 4) Attach the headers to the stream to mimic an IncomingMessage
  const incoming = nodeStream as unknown as IncomingMessage;
  (incoming as any).headers = headers;

  return new Promise((resolve) => {
    const form = formidable({
      uploadDir,
      keepExtensions: true,
      maxFileSize: 500 * 1024 * 1024,
    });

    form.parse(incoming, async (err: unknown, fields: Fields, files: Files) => {
      if (err) {
        console.error("Error parsing form data:", err);
        return resolve(
          NextResponse.json(
            { error: "Error parsing form data" },
            { status: 500 }
          )
        );
      }

      // Retrieve the uploaded file
      const fileKey = Object.keys(files)[0];
      if (!fileKey) {
        return resolve(
          NextResponse.json({ error: "No file field found" }, { status: 400 })
        );
      }

      const fileData = files[fileKey];
      const uploadedFile = Array.isArray(fileData) ? fileData[0] : fileData;
      if (!uploadedFile) {
        return resolve(
          NextResponse.json({ error: "No file uploaded" }, { status: 400 })
        );
      }

      const file = uploadedFile as File;
      // Convert fields to strings if they're arrays
      const paper_name = Array.isArray(fields.name)
        ? fields.name[0]
        : fields.name || file.originalFilename || file.newFilename;
      const articleType = Array.isArray(fields.type)
        ? fields.type[0]
        : fields.type || "Article";
      const status = "Sent";

      const oldPath = file.filepath;
      const fileName = file.originalFilename || file.newFilename;
      const newPath = path.join(uploadDir, fileName);

      try {
        fs.renameSync(oldPath, newPath);
      } catch (renameError) {
        console.error("Error moving file:", renameError);
        return resolve(
          NextResponse.json({ error: "Error saving file" }, { status: 500 })
        );
      }

      // Use the firebase userID passed in the form as "author_id"
      const author_id = Array.isArray(fields.author_id)
        ? fields.author_id[0]
        : fields.author_id?.toString() || null;

      // Upsert user record to satisfy the foreign key constraint, if author_id is provided.
      if (author_id) {
        try {
          await prisma.user.upsert({
            where: { id: author_id },
            update: {},
            create: {
              id: author_id,
              f_name: "Unknown",
              l_name: "Unknown",
              email: "unknown@example.com",
              user_role: "Author",
            },
          });
        } catch (userError) {
          console.error("Error upserting user:", userError);
          return resolve(
            NextResponse.json(
              { error: "Error upserting user" },
              { status: 500 }
            )
          );
        }
      }

      // Handle keywords from the form.
      let keywordArray: string[] = [];
      if (fields.keywords) {
        if (typeof fields.keywords === "string") {
          keywordArray = fields.keywords
            .split(",")
            .map((k) => k.trim())
            .filter((k) => k !== "");
        } else if (Array.isArray(fields.keywords)) {
          keywordArray = fields.keywords
            .map((item) => (typeof item === "string" ? item : ""))
            .join(",")
            .split(",")
            .map((k) => k.trim())
            .filter((k) => k !== "");
        }
      }

      try {
        // Create the Article record along with nested Keyword records
        const createdArticle = await prisma.article.create({
          data: {
            paper_name,
            pdf_path: `/pdfs/${fileName}`,
            author_id,
            type: articleType,
            status,
            keywords: {
              create: keywordArray.map((keyword) => ({ keyword })),
            },
          },
        });

        return resolve(
          NextResponse.json({ success: true, article: createdArticle })
        );
      } catch (dbError) {
        console.error("Error saving to database:", dbError);
        return resolve(
          NextResponse.json(
            { error: "Error saving to database" },
            { status: 500 }
          )
        );
      }
    });
  });
}
