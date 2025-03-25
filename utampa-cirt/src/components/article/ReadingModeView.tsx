"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, ArrowLeft, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ReadingModeViewProps {
  article: any;
  onClose: () => void;
}

const ReadingModeView: React.FC<ReadingModeViewProps> = ({
  article,
  onClose,
}) => {
  // Track reading progress
  const [readingProgress, setReadingProgress] = React.useState(0);
  const [fontSize, setFontSize] = React.useState(16); // Default font size

  // Handle scroll event to update reading progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.body.offsetHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setReadingProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);

    // Set reading mode styling
    document.body.classList.add("reading-mode-active");

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.body.classList.remove("reading-mode-active");
    };
  }, []);

  // Increase font size
  const increaseFontSize = () => {
    if (fontSize < 24) {
      setFontSize(fontSize + 2);
    }
  };

  // Decrease font size
  const decreaseFontSize = () => {
    if (fontSize > 12) {
      setFontSize(fontSize - 2);
    }
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

  return (
    <div
      className="fixed inset-0 bg-white dark:bg-gray-900 z-50 overflow-y-auto"
      style={{
        "--reading-font-size": `${fontSize}px`,
      } as React.CSSProperties}
    >
      {/* Reading progress bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200">
        <div
          className="h-full bg-utred"
          style={{ width: `${readingProgress}%` }}
        ></div>
      </div>

      {/* Controls */}
      <div className="fixed top-4 right-4 flex items-center gap-2 bg-white dark:bg-gray-800 rounded-full shadow-md p-2 z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={decreaseFontSize}
          disabled={fontSize <= 12}
          className="rounded-full w-8 h-8"
        >
          <span className="text-xs">A-</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={increaseFontSize}
          disabled={fontSize >= 24}
          className="rounded-full w-8 h-8"
        >
          <span className="text-lg">A+</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="rounded-full w-8 h-8"
        >
          <X size={18} />
        </Button>
      </div>

      <div className="max-w-3xl mx-auto py-16 px-6 md:px-8">
        {/* Publication info */}
        <div className="text-center mb-12">
          <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
            {article.journal} • {formattedDate}
          </div>

          <h1 className="text-3xl font-bold mb-6 leading-tight">{article.title}</h1>

          <div className="mb-2">
            <span className="font-semibold">{article.author}</span>
            {article.coAuthors && article.coAuthors.length > 0 && (
              <span>, {article.coAuthors.join(", ")}</span>
            )}
          </div>

          <p className="text-gray-600 dark:text-gray-300 mb-6">{article.institution}</p>

          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {article.keywords.map((keyword: string, index: number) => (
              <Badge key={index} variant="outline">
                {keyword}
              </Badge>
            ))}
          </div>
        </div>

        {/* Abstract */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Abstract</h2>
          <p className="text-gray-800 dark:text-gray-200 reading-text">{article.abstract}</p>
        </div>

        {/* Full Text */}
        <div className="mb-12 reading-text">
          <div
            className="prose dark:prose-invert prose-headings:font-bold prose-h2:text-xl prose-h2:mt-8 prose-p:text-gray-800 dark:prose-p:text-gray-200 max-w-none"
            dangerouslySetInnerHTML={{
              __html: article.fullText
                .replace(/\n\n## /g, "</p><h2>")
                .replace(/\n\n/g, "</p><p>")
                .replace(/^## /g, "<h2>")
                .replace(/^/g, "<p>") + "</p>",
            }}
          />
        </div>

        {/* References */}
        <div className="mb-12 border-t pt-8">
          <h2 className="text-xl font-bold mb-4">References</h2>
          <div className="space-y-2 reading-text">
            {article.references.map((reference: string, index: number) => (
              <p key={index} className="pl-8 -indent-8">
                {reference}
              </p>
            ))}
          </div>
        </div>

        {/* Reading controls */}
        <div className="fixed bottom-4 left-4 right-4 flex justify-between">
          <Button
            variant="ghost"
            className="rounded-full shadow-md bg-white dark:bg-gray-800"
            onClick={onClose}
          >
            Exit Reading Mode
          </Button>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              className="rounded-full shadow-md bg-white dark:bg-gray-800"
            >
              <ArrowLeft size={16} className="mr-2" />
              Previous
            </Button>
            <Button
              variant="ghost"
              className="rounded-full shadow-md bg-white dark:bg-gray-800"
            >
              Next
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadingModeView;
