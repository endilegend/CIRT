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
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Article, User } from "@prisma/client";

type ArticleWithAuthor = Article & {
  author: User;
};

type UserSuggestion = {
  id: string;
  f_name: string;
  l_name: string;
  email: string;
};

export default function EditorPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<ArticleWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editorQueries, setEditorQueries] = useState<{ [key: string]: string }>(
    {}
  );
  const [submitted, setSubmitted] = useState<{ [key: string]: boolean }>({});
  const [filteredSuggestions, setFilteredSuggestions] = useState<{
    [key: string]: UserSuggestion[];
  }>({});

  useEffect(() => {
    const fetchSentArticles = async () => {
      try {
        const response = await fetch("/api/articles/sent");
        if (!response.ok) {
          throw new Error("Failed to fetch articles");
        }
        const data = await response.json();
        setArticles(data.articles);
        setError(null);
      } catch (error) {
        console.error("Error fetching articles:", error);
        setError("Failed to load articles");
      } finally {
        setLoading(false);
      }
    };

    fetchSentArticles();
  }, []);

  const handleInputChange = async (id: string, value: string) => {
    setEditorQueries((prev) => ({ ...prev, [id]: value }));

    if (!value.trim()) {
      setFilteredSuggestions((prev) => ({ ...prev, [id]: [] }));
      return;
    }

    try {
      const response = await fetch(
        `/api/users/search?query=${encodeURIComponent(value)}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setFilteredSuggestions((prev) => ({ ...prev, [id]: data.users }));
    } catch (error) {
      console.error("Error fetching user suggestions:", error);
      setFilteredSuggestions((prev) => ({ ...prev, [id]: [] }));
    }
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    articleId: string,
    userId?: string
  ) => {
    e.preventDefault();
    if (!userId) return;

    try {
      const response = await fetch(`/api/articles/${articleId}/assign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error("Failed to assign editor");
      }

      setSubmitted((prev) => ({ ...prev, [articleId]: true }));
      setEditorQueries((prev) => ({ ...prev, [articleId]: "" }));
      setFilteredSuggestions((prev) => ({ ...prev, [articleId]: [] }));
    } catch (error) {
      console.error("Error assigning editor:", error);
      alert("Failed to assign editor. Please try again.");
    }
  };

  return (
    <MainLayout isAuthenticated={true}>
      <div className="bg-slate-50 py-8 min-h-screen">
        <div className="ut-container">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Edit Submissions</h1>
            <p className="text-gray-600">
              View and edit assigned paper, article, and poster submissions
            </p>
          </div>

          {/* Submissions Card */}
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Submissions/Entries</CardTitle>
                <CardDescription>
                  Current submissions waiting to be assigned
                </CardDescription>
                <CardDescription className="text-right font-bold text-gray-700">
                  Number of Submissions to Review: {articles.length}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-4">Loading submissions...</div>
                ) : error ? (
                  <div className="text-center text-red-500 py-4">{error}</div>
                ) : articles.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    No submissions waiting for review.
                  </div>
                ) : (
                  <div className="scrollable-table">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Date Uploaded</TableHead>
                          <TableHead>Author</TableHead>
                          <TableHead>Assign to</TableHead>
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
                              {new Date(article.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              {article.author.f_name} {article.author.l_name}
                            </TableCell>
                            <TableCell className="relative">
                              {submitted[article.id] ? (
                                <span className="font-semibold text-green-600">
                                  Assigned
                                </span>
                              ) : (
                                <div className="relative">
                                  <Input
                                    placeholder="Search for users..."
                                    className="px-1"
                                    value={editorQueries[article.id] || ""}
                                    onChange={(e) =>
                                      handleInputChange(
                                        article.id,
                                        e.target.value
                                      )
                                    }
                                  />
                                  {filteredSuggestions[article.id]?.length >
                                    0 && (
                                    <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-60 overflow-auto">
                                      {filteredSuggestions[article.id].map(
                                        (user) => (
                                          <li
                                            key={user.id}
                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex flex-col"
                                            onClick={() => {
                                              handleSubmit(
                                                new Event("submit") as any,
                                                article.id,
                                                user.id
                                              );
                                            }}
                                          >
                                            <span className="font-medium">
                                              {user.f_name} {user.l_name}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                              {user.email}
                                            </span>
                                          </li>
                                        )
                                      )}
                                    </ul>
                                  )}
                                </div>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <Link href={`/article/${article.id}`}>
                                <Button className="hover:text-utred" size="sm">
                                  View
                                </Button>
                              </Link>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
