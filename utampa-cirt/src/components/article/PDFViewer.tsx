"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PDFViewerProps {
  articleId: number;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ articleId }) => {
  const [pdfContent, setPdfContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        const response = await fetch(`/api/articles/${articleId}/pdf`);
        if (!response.ok) {
          throw new Error("Failed to fetch PDF");
        }
        const data = await response.json();
        setPdfContent(data.content);
      } catch (error) {
        console.error("Error fetching PDF:", error);
        setError("Failed to load PDF content");
      } finally {
        setLoading(false);
      }
    };

    fetchPdf();
  }, [articleId]);

  if (loading) {
    return <div className="text-center py-8">Loading PDF content...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-8">{error}</div>;
  }

  if (!pdfContent) {
    return <div className="text-center py-8">No PDF content available</div>;
  }

  return (
    <div className="w-full">
      <div className="prose max-w-none">
        <pre className="whitespace-pre-wrap font-mono text-sm bg-gray-50 p-4 rounded-lg">
          {pdfContent}
        </pre>
      </div>
    </div>
  );
};

export { PDFViewer };
