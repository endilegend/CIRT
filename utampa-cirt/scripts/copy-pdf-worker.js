import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Ensure the public directory exists
const publicDir = path.join(process.cwd(), "public");
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

// Copy the PDF.js worker file
const workerSource = path.join(
  process.cwd(),
  "node_modules",
  "pdfjs-dist",
  "legacy",
  "build",
  "pdf.worker.js"
);
const workerDest = path.join(publicDir, "pdf.worker.js");

fs.copyFileSync(workerSource, workerDest);
console.log("PDF.js worker file copied to public directory");
