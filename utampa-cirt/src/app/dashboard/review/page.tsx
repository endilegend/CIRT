"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Article, User } from "@prisma/client";

type ArticleWithAuthor = Article & {
  author: User;
};

function getStatusClass(status: string | null) {
  switch (status) {
    case "Under_Review":
      return "px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full";
    case "Approved":
      return "px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full";
    case "Declined":
      return "px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full";
    default:
      return "px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full";
  }
}

export default function ReviewPage() {
  const [articles, setArticles] = useState<ArticleWithAuthor[]>([]);
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
    const fetchAssignedArticles = async () => {
      if (!userId) return;

      try {
        const response = await fetch(`/api/reviews/assigned/${userId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch assigned articles");
        }
        const data = await response.json();
        setArticles(data.articles);
        setError(null);
      } catch (error) {
        console.error("Error fetching assigned articles:", error);
        setError("Failed to load assigned articles");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchAssignedArticles();
    }
  }, [userId]);

  return (
    <MainLayout isAuthenticated={!!userId}>
      <div className="bg-slate-50 py-8 min-h-screen">
        <div className="ut-container">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Review Submissions</h1>
            <p className="text-gray-600">
              Review and evaluate assigned submissions
            </p>
          </div>
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Submissions Assigned to You</CardTitle>
                <CardDescription className="text-right font-bold text-gray-700">
                  Number of Submissions Assigned: {articles.length}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-4">Loading submissions...</div>
                ) : error ? (
                  <div className="text-center text-red-500 py-4">{error}</div>
                ) : articles.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    No submissions are currently assigned to you for review.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Author</TableHead>
                        <TableHead>Date Uploaded</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {articles.map((article) => (
                        <TableRow key={article.id}>
                          <TableCell className="font-medium">
                            {article.paper_name}
                          </TableCell>
                          <TableCell>{article.type}</TableCell>
                          <TableCell>
                            {article.author.f_name} {article.author.l_name}
                          </TableCell>
                          <TableCell>
                            {new Date(article.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <span className={getStatusClass(article.status)}>
                              {article.status?.replace("_", " ")}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Link href={`/article/${article.id}`}>
                              <Button className="hover:text-utred" size="sm">
                                Review
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
