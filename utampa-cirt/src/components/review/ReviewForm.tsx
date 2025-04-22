"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Article, User, Status } from "@prisma/client";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

type ArticleWithAuthor = Article & {
  author: User;
};

interface ReviewFormProps {
  articleId: string;
}

export function ReviewForm({ articleId }: ReviewFormProps) {
  const [article, setArticle] = useState<ArticleWithAuthor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [comments, setComments] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
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
      if (!userId) return;

      try {
        const response = await fetch(`/api/articles/${articleId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch article");
        }
        const data = await response.json();
        setArticle(data.article);

        // Fetch existing review if any
        const reviewResponse = await fetch(
          `/api/reviews/${articleId}/${userId}`
        );
        if (reviewResponse.ok) {
          const reviewData = await reviewResponse.json();
          if (reviewData.review?.comments) {
            setComments(reviewData.review.comments);
          }
        }
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

  const handleDownload = async () => {
    if (!article) return;

    try {
      // If the pdf_path is already a full URL, use it directly
      const pdfUrl = article.pdf_path.startsWith("http")
        ? article.pdf_path
        : supabase.storage.from("articles").getPublicUrl(article.pdf_path).data
            .publicUrl;

      const response = await fetch(pdfUrl);
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleSubmit = async (newStatus: Status) => {
    if (!article || !userId) return;
    setSubmitting(true);

    try {
      const formData = new FormData();
      if (uploadedFile) {
        formData.append("file", uploadedFile);
      }
      formData.append("comments", comments);
      formData.append("status", newStatus);
      formData.append("reviewerId", userId);

      const response = await fetch(`/api/reviews/${article.id}/submit`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to submit review");
      }

      // Use Next.js router for navigation
      router.push("/dashboard/review");
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error || !article) {
    return (
      <div className="text-center text-red-500 py-8">
        {error || "Article not found"}
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>{article.paper_name}</CardTitle>
          <CardDescription>
            By {article.author.f_name} {article.author.l_name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Article Details</h3>
              <p>
                <span className="font-medium">Type:</span> {article.type}
              </p>
              <p>
                <span className="font-medium">Status:</span>{" "}
                {article.status?.replace("_", " ")}
              </p>
              <p>
                <span className="font-medium">Submitted:</span>{" "}
                {new Date(article.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="space-y-2">
              <Button onClick={handleDownload} className="w-full">
                Download Article
              </Button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className="block font-medium">
                  Upload Reviewed Version
                </label>
                <span className="text-sm text-gray-500">(Optional)</span>
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

            <div className="space-y-2">
              <label className="block font-medium">Comments</label>
              <Textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Enter your review comments here..."
                className="min-h-[200px]"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                onClick={() => handleSubmit("Reviewed")}
                disabled={submitting || !comments}
                className="flex-1 bg-yellow-600 hover:bg-yellow-700"
              >
                Submit for Revision
              </Button>
              <Button
                onClick={() => handleSubmit("Approved")}
                disabled={submitting}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                Approve
              </Button>
              <Button
                onClick={() => handleSubmit("Declined")}
                disabled={submitting}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                Decline
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
