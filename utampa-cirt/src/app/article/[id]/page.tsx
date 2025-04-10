"use client";

import React, { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Article, User } from "@prisma/client";
import { SpartyChat } from "@/components/SpartyChat";

type ArticleWithAuthor = Article & {
  author: User;
};

export default function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const [article, setArticle] = useState<ArticleWithAuthor | null>(null);
  const [pdfContent, setPdfContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`/api/articles/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch article");
        }
        const data = await response.json();
        setArticle(data.article);

        // Fetch PDF content
        const pdfResponse = await fetch(`/api/articles/${id}/pdf`);

        if (!pdfResponse.ok) {
          const errorData = await pdfResponse
            .json()
            .catch(() => ({ error: "Failed to parse error response" }));
          console.error("PDF Error:", errorData);
          throw new Error(errorData.error || "Failed to fetch PDF content");
        }

        const pdfData = await pdfResponse.json().catch(() => null);
        if (!pdfData || !pdfData.content) {
          throw new Error("No PDF content available");
        }
        setPdfContent(pdfData.content);
      } catch (error) {
        console.error("Error:", error);
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchArticle();
    }
  }, [id]);

  const handleDownload = async () => {
    if (!article) return;

    try {
      const response = await fetch(`/api/download/${article.pdf_path}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = article.paper_name + ".pdf";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading file:", error);
      setError("Failed to download file");
    }
  };

  if (loading) {
    return (
      <MainLayout isAuthenticated={!!userId}>
        <div className="text-center py-8">Loading...</div>
      </MainLayout>
    );
  }

  if (error || !article) {
    return (
      <MainLayout isAuthenticated={!!userId}>
        <div className="text-center text-red-500 py-8">
          {error || "Article not found"}
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout isAuthenticated={!!userId}>
      <div className="bg-slate-50 py-8 min-h-screen">
        <div className="ut-container">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">{article.paper_name}</h1>
            <p className="text-gray-600">
              By {article.author.f_name} {article.author.l_name}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* PDF Viewer */}
            <div className="lg:col-span-3">
              <iframe
                src={article.pdf_path}
                className="w-full h-[800px] rounded-lg border bg-white"
                title={article.paper_name}
              />
            </div>

            {/* Sparty Chat */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <SpartyChat articleContent={pdfContent || ""} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
