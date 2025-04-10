"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { Article, Review, Status } from "@prisma/client";
import { PDFViewer } from "@/components/article/PDFViewer";

type ArticleWithReview = Article & {
  review?: Review;
};

export default function AuthorArticlePage({
  params,
}: {
  params: { id: string };
}) {
  const [article, setArticle] = useState<ArticleWithReview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const router = useRouter();

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
        const response = await fetch(`/api/articles/${params.id}`);
        if (!response.ok) throw new Error("Failed to fetch article");
        const data = await response.json();

        // If article is approved, redirect to regular article view
        if (data.article.status === "Approved") {
          router.push(`/article/${params.id}`);
          return;
        }

        // Fetch review for this article
        const reviewResponse = await fetch(`/api/reviews/${params.id}/latest`);
        if (reviewResponse.ok) {
          const reviewData = await reviewResponse.json();
          data.article.review = reviewData.review;
        }

        setArticle(data.article);
      } catch (error) {
        console.error("Error:", error);
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchArticle();
    }
  }, [params.id, router]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleResubmit = async () => {
    if (!selectedFile || !article) return;

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("status", "Under_Review");

    try {
      const response = await fetch(`/api/articles/${article.id}/resubmit`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to resubmit article");

      // Refresh the page to show updated status
      router.refresh();
    } catch (error) {
      console.error("Error:", error);
      setError(
        error instanceof Error ? error.message : "Failed to resubmit article"
      );
    }
  };

  if (loading) {
    return (
      <MainLayout isAuthenticated={!!userId}>
        <div className="flex justify-center items-center min-h-screen">
          Loading...
        </div>
      </MainLayout>
    );
  }

  if (error || !article) {
    return (
      <MainLayout isAuthenticated={!!userId}>
        <div className="flex justify-center items-center min-h-screen text-red-500">
          {error || "Article not found"}
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout isAuthenticated={!!userId}>
      <div className="bg-slate-50 py-8 min-h-screen">
        <div className="ut-container">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{article.paper_name}</CardTitle>
              <CardDescription>
                Status:{" "}
                <span className="font-semibold">
                  {article.status?.replace("_", " ")}
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">
                  Reviewer Comments
                </h3>
                {article.review ? (
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    {article.review.comments}
                  </div>
                ) : (
                  <p className="text-gray-500">No reviewer comments yet.</p>
                )}
              </div>

              {(article.status === "Reviewed" ||
                article.status === "Under_Review" ||
                article.status === "Declined") && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Resubmit Article
                  </h3>
                  <div className="space-y-4">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
                    />
                    <Button
                      onClick={handleResubmit}
                      disabled={!selectedFile}
                      className="w-full"
                    >
                      Submit Updated Version
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Article Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <PDFViewer articleId={article.id} />
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
