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
import { Article, User, Review, Status } from "@prisma/client";
import { supabase } from "@/lib/supabase";

type ArticleWithAuthor = Article & {
  author: User;
  reviews: (Review & {
    reviewer: User;
    status: Status;
  })[];
};

type PageParams = {
  id: string;
};

export default function AuthorArticlePage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const [article, setArticle] = useState<ArticleWithAuthor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const resolvedParams = React.use(params);
  const articleId = resolvedParams.id;

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
      if (!userId) return;

      try {
        const response = await fetch(`/api/articles/${articleId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch article");
        }
        const data = await response.json();
        setArticle(data.article);
        setError(null);
      } catch (error) {
        console.error("Error:", error);
        setError("Failed to load article");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchArticle();
    }
  }, [articleId, userId]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleResubmit = async () => {
    if (!article || !userId || !uploadedFile) return;
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("file", uploadedFile);
      formData.append("status", "Under_Review");

      // Get the current Firebase token
      const auth = getAuth();
      const token = await auth.currentUser?.getIdToken();
      if (!token) {
        throw new Error("Not authenticated");
      }

      const response = await fetch(`/api/articles/${article.id}/resubmit`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to resubmit article");
      }

      // Refresh the page to show updated status
      window.location.reload();
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to resubmit article");
    } finally {
      setSubmitting(false);
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

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Article Details</CardTitle>
                <CardDescription>
                  Status: {article.status?.replace("_", " ")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Article Information</h3>
                    <p>
                      <span className="font-medium">Type:</span> {article.type}
                    </p>
                    <p>
                      <span className="font-medium">Submitted:</span>{" "}
                      {new Date(article.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Button
                      onClick={() => {
                        const pdfUrl = article.pdf_path.startsWith("http")
                          ? article.pdf_path
                          : supabase.storage
                              .from("articles")
                              .getPublicUrl(article.pdf_path).data.publicUrl;
                        window.open(pdfUrl, "_blank");
                      }}
                      className="w-full"
                    >
                      View PDF
                    </Button>
                  </div>

                  {article.status === "Reviewed" && (
                    <>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <label className="block font-medium">
                            Upload Revised Version
                          </label>
                        </div>
                        <div className="flex items-center gap-4">
                          <input
                            type="file"
                            accept=".pdf"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-500
                              file:mr-4 file:py-2 file:px-4
                              file:rounded-md file:border-0
                              file:text-sm file:font-semibold
                              file:bg-slate-50 file:text-slate-700
                              hover:file:bg-slate-100"
                          />
                          {uploadedFile && (
                            <span className="text-sm text-green-600">
                              {uploadedFile.name}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-4 pt-4">
                        <Button
                          onClick={handleResubmit}
                          disabled={submitting || !uploadedFile}
                          className="flex-1 bg-blue-600 hover:bg-blue-700"
                        >
                          Resubmit Article
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {article.reviews && article.reviews.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Reviewer Comments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {article.reviews.map((review, index) => (
                      <div key={index} className="border-b pb-4 last:border-0">
                        <div className="font-medium mb-2">
                          Reviewer: {review.reviewer.f_name}{" "}
                          {review.reviewer.l_name}
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          Status: {review.status?.replace("_", " ")}
                        </div>
                        <div className="bg-slate-50 p-4 rounded-md">
                          {review.comments}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
