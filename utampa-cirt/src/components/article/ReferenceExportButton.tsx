"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Database,
  Download,
  Bookmark,
  Copy,
  FileText,
  ExternalLink,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface ReferenceExportButtonProps {
  article: any;
}

const ReferenceExportButton: React.FC<ReferenceExportButtonProps> = ({
  article,
}) => {
  const [openDialog, setOpenDialog] = useState(false);

  // Format the article metadata for different export formats

  // BibTeX format
  const bibTexCitation = `@article{${article.author.split(" ").pop().toLowerCase()}${new Date(
    article.publicationDate
  ).getFullYear()},
  title = {${article.title}},
  author = {${article.author}${
    article.coAuthors?.length ? " and " + article.coAuthors.join(" and ") : ""
  }},
  journal = {${article.journal}},
  volume = {${article.volume}},
  number = {${article.issue}},
  pages = {${article.pages}},
  year = {${new Date(article.publicationDate).getFullYear()}},
  doi = {${article.doi}}
}`;

  // RIS format (for Reference Manager, EndNote, etc.)
  const risCitation = `TY  - JOUR
T1  - ${article.title}
AU  - ${article.author}
${article.coAuthors?.map((ca: string) => `AU  - ${ca}`).join("\n") || ""}
JO  - ${article.journal}
VL  - ${article.volume}
IS  - ${article.issue}
SP  - ${article.pages.split("-")[0]}
EP  - ${article.pages.split("-")[1]}
PY  - ${new Date(article.publicationDate).getFullYear()}
DO  - ${article.doi}
ER  - `;

  // CSL-JSON format (for Zotero, Mendeley, etc.)
  const cslJsonCitation = {
    type: "article-journal",
    title: article.title,
    author: [
      {
        family: article.author.split(" ").pop(),
        given: article.author.split(" ").slice(0, -1).join(" "),
      },
      ...(article.coAuthors?.map((ca: string) => ({
        family: ca.split(" ").pop(),
        given: ca.split(" ").slice(0, -1).join(" "),
      })) || []),
    ],
    "container-title": article.journal,
    volume: article.volume,
    issue: article.issue,
    page: article.pages,
    issued: {
      "date-parts": [[new Date(article.publicationDate).getFullYear()]],
    },
    DOI: article.doi,
  };

  // Handle copy to clipboard
  const handleCopy = (text: string, format: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${format} format copied to clipboard`);
  };

  // Handle download file
  const handleDownload = (content: string, format: string, extension: string) => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${article.title.slice(0, 30).replace(/[^\w\s]/gi, "")}_${format}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`${format} file downloaded`);
  };

  // Zotero direct export URL (would work if the user has Zotero installed)
  const zoteroUrl = `zotero://select/items/new?title=${encodeURIComponent(
    article.title
  )}&journalAbbreviation=${encodeURIComponent(
    article.journal
  )}&volume=${encodeURIComponent(article.volume)}&issue=${encodeURIComponent(
    article.issue
  )}&pages=${encodeURIComponent(article.pages)}&date=${encodeURIComponent(
    new Date(article.publicationDate).getFullYear().toString()
  )}&doi=${encodeURIComponent(article.doi)}`;

  // Mendeley direct URL
  const mendeleyUrl = `https://www.mendeley.com/import/?url=${encodeURIComponent(
    `https://doi.org/${article.doi}`
  )}`;

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm">
            <Database className="h-4 w-4 mr-2" />
            Cite & Export
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72" align="end">
          <div className="space-y-2">
            <h3 className="font-medium">Export to Reference Manager</h3>
            <p className="text-sm text-gray-500">
              Export this article to your reference management software.
            </p>

            <div className="space-y-1">
              <div
                className="reference-export-option"
                onClick={() => window.open(zoteroUrl, "_blank")}
              >
                <img
                  src="https://www.zotero.org/static/images/icons/zotero-icon-32.png"
                  alt="Zotero"
                  className="h-6 w-6"
                />
                <div>
                  <div className="font-medium">Zotero</div>
                  <div className="text-xs text-gray-500">Direct import (if installed)</div>
                </div>
              </div>

              <div
                className="reference-export-option"
                onClick={() => window.open(mendeleyUrl, "_blank")}
              >
                <img
                  src="https://www.mendeley.com/ui/assets/images/mendeley-logo.svg"
                  alt="Mendeley"
                  className="h-6 w-6"
                />
                <div>
                  <div className="font-medium">Mendeley</div>
                  <div className="text-xs text-gray-500">Web importer</div>
                </div>
              </div>

              <DialogTrigger asChild>
                <div className="reference-export-option">
                  <FileText className="h-6 w-6 text-gray-600" />
                  <div>
                    <div className="font-medium">Export Citation File</div>
                    <div className="text-xs text-gray-500">BibTeX, RIS, or CSL-JSON</div>
                  </div>
                </div>
              </DialogTrigger>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Export Citation</DialogTitle>
            <DialogDescription>
              Download or copy the citation in your preferred format
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <h3 className="font-medium mb-2 text-sm">BibTeX Format</h3>
              <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md text-xs font-mono overflow-x-auto max-h-32">
                <pre>{bibTexCitation}</pre>
              </div>
              <div className="flex justify-between mt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCopy(bibTexCitation, "BibTeX")}
                >
                  <Copy className="h-3 w-3 mr-1" /> Copy
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDownload(bibTexCitation, "BibTeX", "bib")}
                >
                  <Download className="h-3 w-3 mr-1" /> Download .bib
                </Button>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2 text-sm">RIS Format</h3>
              <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md text-xs font-mono overflow-x-auto max-h-32">
                <pre>{risCitation}</pre>
              </div>
              <div className="flex justify-between mt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCopy(risCitation, "RIS")}
                >
                  <Copy className="h-3 w-3 mr-1" /> Copy
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDownload(risCitation, "RIS", "ris")}
                >
                  <Download className="h-3 w-3 mr-1" /> Download .ris
                </Button>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2 text-sm">CSL-JSON Format</h3>
              <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md text-xs font-mono overflow-x-auto max-h-32">
                <pre>{JSON.stringify(cslJsonCitation, null, 2)}</pre>
              </div>
              <div className="flex justify-between mt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCopy(JSON.stringify(cslJsonCitation, null, 2), "CSL-JSON")}
                >
                  <Copy className="h-3 w-3 mr-1" /> Copy
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDownload(JSON.stringify(cslJsonCitation, null, 2), "CSL-JSON", "json")}
                >
                  <Download className="h-3 w-3 mr-1" /> Download .json
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-4 text-xs text-gray-500">
            <p>For direct import into reference managers:</p>
            <div className="flex gap-2 mt-2">
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={() => window.open(zoteroUrl, "_blank")}
              >
                Zotero <ExternalLink className="h-3 w-3 ml-1" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={() => window.open(mendeleyUrl, "_blank")}
              >
                Mendeley <ExternalLink className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ReferenceExportButton;
