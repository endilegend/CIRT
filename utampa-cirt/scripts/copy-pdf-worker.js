import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Source and destination paths
const sourcePath = path.join(
  process.cwd(),
  "node_modules",
  "pdfjs-dist",
  "build",
  "pdf.worker.min.js"
);
const destPath = path.join(process.cwd(), "public", "pdf.worker.min.js");

// Copy the file
fs.copyFileSync(sourcePath, destPath);
console.log("PDF.js worker file copied to public directory");
