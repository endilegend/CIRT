import { copyFile, mkdir } from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

async function copyPdfWorker() {
  try {
    const sourceFile = join(
      __dirname,
      "../node_modules/pdfjs-dist/build/pdf.worker.min.js"
    );
    const targetDir = join(__dirname, "../public");
    const targetFile = join(targetDir, "pdf.worker.min.js");

    // Create public directory if it doesn't exist
    await mkdir(targetDir, { recursive: true });

    // Copy the worker file
    await copyFile(sourceFile, targetFile);
    console.log("PDF.js worker file copied successfully");
  } catch (error) {
    console.error("Error copying PDF.js worker file:", error);
    process.exit(1);
  }
}

copyPdfWorker();
