"use client";

import React, { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useParams } from "next/navigation";
import { Article, User, Keyword } from "@prisma/client";
import { SpartyChat } from "@/components/SpartyChat";

type ArticleWithRelations = Article & {
  author: User | null;
  keywords: Keyword[];
};

export default function ArticlePage() {
  const params = useParams();
  const [article, setArticle] = useState<ArticleWithRelations | null>(null);
  const [pdfContent, setPdfContent] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        // Fetch article data
        const articleResponse = await fetch(`/api/articles/${params.id}`);
        if (!articleResponse.ok) {
          throw new Error("Network response was not ok");
        }
        const articleData = await articleResponse.json();
        setArticle(articleData);

        // Fetch PDF content
        const pdfResponse = await fetch(`/api/articles/${params.id}/pdf`);
        if (!pdfResponse.ok) {
          throw new Error("Failed to fetch PDF content");
        }
        const pdfData = await pdfResponse.json();
        setPdfContent(pdfData.content);
      } catch (error) {
        console.error("Error fetching article:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [params.id]);

  if (loading) {
    return (
      <MainLayout isAuthenticated={true}>
        <div className="bg-slate-50 py-8 min-h-screen">
          <div className="ut-container">
            <div className="flex justify-center items-center h-32">
              <p>Loading...</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!article) {
    return (
      <MainLayout isAuthenticated={true}>
        <div className="bg-slate-50 py-8 min-h-screen">
          <div className="ut-container">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
              <p>The requested article could not be found.</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout isAuthenticated={true}>
      <div className="bg-slate-50 py-8 min-h-screen">
        <div className="ut-container">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* PDF Viewer */}
            <div className="lg:col-span-3">
              <iframe
                src={article.pdf_path}
                width="100%"
                height="800px"
                className="rounded-lg border"
              />
            </div>

            {/* Sparty Chat */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <SpartyChat articleContent={pdfContent} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
