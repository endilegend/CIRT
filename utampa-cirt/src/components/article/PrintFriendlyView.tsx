"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface PrintFriendlyViewProps {
  article: any;
  onClose: () => void;
}

const PrintFriendlyView: React.FC<PrintFriendlyViewProps> = ({
  article,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    // In a real implementation this would generate a PDF
    // For now we'll just show a toast to simulate the action
    toast.success("PDF download started");
  };

  // Format the date
  const formattedDate = new Date(article.publicationDate).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  // Use this ref to focus on the container when it mounts
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    // Focus on the container for better keyboard navigation
    if (containerRef.current) {
      containerRef.current.focus();
    }

    // Add a class to the body to trigger print-specific styles
    document.body.classList.add("print-view-open");

    // Remove the class when the component unmounts
    return () => {
      document.body.classList.remove("print-view-open");
    };
  }, []);

  return (
    <div
      className="fixed inset-0 bg-white z-50 overflow-y-auto"
      ref={containerRef}
      tabIndex={-1}
    >
      <div className="print:hidden flex justify-between items-center p-4 border-b sticky top-0 bg-white shadow-sm">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handlePrint} className="bg-utred">
            Print
          </Button>
          <Button variant="outline" onClick={handleDownloadPDF}>
            Download PDF
          </Button>
        </div>
        <div className="text-sm text-gray-500">
          CIRT Database • University of Tampa
        </div>
      </div>

      <div className="container mx-auto p-8 max-w-4xl print:p-0 print:max-w-none">
        {/* Publication Info Header */}
        <div className="text-center mb-8 print:mb-6">
          <p className="text-sm text-gray-500 mb-2">
            {article.journal} • Volume {article.volume}, Issue {article.issue} •
            Pages {article.pages} • {formattedDate}
          </p>
          <p className="text-sm text-gray-500 mb-6">
            DOI: {article.doi}
          </p>

          <h1 className="text-3xl font-bold mb-4 print:text-2xl">{article.title}</h1>

          <div className="mb-2">
            <span className="font-semibold">{article.author}</span>
            {article.coAuthors && article.coAuthors.length > 0 && (
              <span>, {article.coAuthors.join(", ")}</span>
            )}
          </div>

          <p className="text-gray-600 mb-4">{article.institution}</p>

          <div className="flex flex-wrap gap-2 justify-center mb-8 print:mb-6">
            {article.keywords.map((keyword: string, index: number) => (
              <Badge key={index} variant="outline" className="print:bg-gray-100">
                {keyword}
              </Badge>
            ))}
          </div>
        </div>

        {/* Abstract */}
        <div className="mb-8 print:mb-6">
          <h2 className="text-xl font-bold mb-4 print:text-lg">Abstract</h2>
          <p className="text-gray-800">{article.abstract}</p>
        </div>

        {/* Full Text */}
        <div className="mb-8 print:mb-6">
          <h2 className="text-xl font-bold mb-4 print:text-lg">Full Text</h2>
          <div className="prose max-w-none print:text-sm">
            <div
              dangerouslySetInnerHTML={{
                __html: article.fullText
                  .replace(/\n\n## /g, "</p><h3>")
                  .replace(/\n\n/g, "</p><p>")
                  .replace(/^## /g, "<h3>")
                  .replace(/^/g, "<p>") + "</p>",
              }}
            />
          </div>
        </div>

        {/* References */}
        <div className="mb-8 print:mb-6">
          <h2 className="text-xl font-bold mb-4 print:text-lg">References</h2>
          <div className="space-y-2 print:text-sm">
            {article.references.map((reference: string, index: number) => (
              <p key={index} className="pl-8 -indent-8">
                {reference}
              </p>
            ))}
          </div>
        </div>

        {/* Footer for print */}
        <div className="hidden print:block mt-12 pt-4 border-t text-center text-xs text-gray-500">
          <p>
            Retrieved from CIRT Database, University of Tampa
            (https://cirt.ut.edu/article/{article.id})
          </p>
          <p>Printed on {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default PrintFriendlyView;
