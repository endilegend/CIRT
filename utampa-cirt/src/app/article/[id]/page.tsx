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
import { TextToSpeech } from "@/components/article/TextToSpeech";

// Define a type that extends Article with author information
type ArticleWithAuthor = Article & {
  author: User;
};

export default function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Extract article ID from params
  const { id } = React.use(params);

  // State management for article data, PDF content, loading state, and errors
  const [article, setArticle] = useState<ArticleWithAuthor | null>(null);
  const [pdfContent, setPdfContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Ref to track if views have been incremented to prevent double counting
  const viewsIncremented = React.useRef(false);

  // Effect to handle Firebase authentication state
  useEffect(() => {
    const auth = getAuth();
    // Subscribe to auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, []);

  // Effect to fetch article data and handle view counting
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        // Fetch article data
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

        // Increment views only if not already incremented in this session
        if (!viewsIncremented.current) {
          try {
            const viewsResponse = await fetch(`/api/articles/${id}/views`, {
              method: "POST",
            });
            if (viewsResponse.ok) {
              const updatedArticle = await viewsResponse.json();
              // Update local state with new view count
              setArticle((prev) =>
                prev ? { ...prev, views: updatedArticle.views } : null
              );
              // Mark views as incremented to prevent double counting
              viewsIncremented.current = true;
            }
          } catch (error) {
            console.error("Error incrementing views:", error);
          }
        }
      } catch (error) {
        console.error("Error:", error);
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if we have an article ID
    if (id) {
      fetchArticle();
    }
  }, [id]);

  // Function to handle PDF download
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

  // Loading state UI
  if (loading) {
    return (
      <MainLayout isAuthenticated={!!userId}>
        <div className="text-center py-8">Loading...</div>
      </MainLayout>
    );
  }

  // Error state UI
  if (error || !article) {
    return (
      <MainLayout isAuthenticated={!!userId}>
        <div className="text-center text-red-500 py-8">
          {error || "Article not found"}
        </div>
      </MainLayout>
    );
  }

  // Main article page UI
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
            {/* PDF Viewer Section */}
            <div className="lg:col-span-3">
              <div className="flex justify-between items-center mb-4">
                <Button onClick={handleDownload} variant="outline" size="sm">
                  Download PDF
                </Button>
                {article.pdf_path && <TextToSpeech articleId={id} />}
              </div>
              <iframe
                src={article.pdf_path}
                className="w-full h-[800px] rounded-lg border bg-white"
                title={article.paper_name}
              />
            </div>

            {/* Sparty Chat Section */}
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
