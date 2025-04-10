"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Dynamically import react-pdf components to avoid SSR issues
const PDFDocument = dynamic(
  () => import("react-pdf").then((mod) => mod.Document),
  {
    ssr: false,
  }
);

const PDFPage = dynamic(() => import("react-pdf").then((mod) => mod.Page), {
  ssr: false,
});

// Configure PDF.js worker
import { pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFViewerProps {
  articleId: number;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ articleId }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  React.useEffect(() => {
    const fetchPdfUrl = async () => {
      try {
        const response = await fetch(`/api/articles/${articleId}`);
        if (!response.ok) throw new Error("Failed to fetch article");
        const data = await response.json();
        if (data.article.pdf_path) {
          setPdfUrl(data.article.pdf_path);
        } else {
          setError("No PDF available for this article");
        }
      } catch (error) {
        console.error("Error:", error);
        setError("Failed to load PDF");
      } finally {
        setLoading(false);
      }
    };

    fetchPdfUrl();
  }, [articleId]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setLoading(false);
  }

  function changePage(offset: number) {
    setPageNumber((prevPageNumber) => {
      const newPageNumber = prevPageNumber + offset;
      return Math.min(Math.max(1, newPageNumber), numPages || 1);
    });
  }

  if (loading) {
    return <div className="text-center py-8">Loading PDF...</div>;
  }

  if (error || !pdfUrl) {
    return <div className="text-center text-red-500 py-8">{error}</div>;
  }

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-3xl border rounded-lg p-4 bg-white">
        <PDFDocument
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={<div className="text-center py-8">Loading PDF...</div>}
          error={
            <div className="text-center text-red-500 py-8">
              Failed to load PDF.
            </div>
          }
        >
          <PDFPage
            pageNumber={pageNumber}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            className="max-w-full h-auto"
            width={800}
          />
        </PDFDocument>

        {numPages && numPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => changePage(-1)}
              disabled={pageNumber <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              Page {pageNumber} of {numPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => changePage(1)}
              disabled={pageNumber >= (numPages || 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export { PDFViewer };
