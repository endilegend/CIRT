"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Article, User, Keyword } from "@prisma/client";
import Link from "next/link";
import { BookOpen, Calendar, Users, Search, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

type ArticleWithRelations = Article & {
  author: User | null;
  keywords: Keyword[];
};

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const [results, setResults] = useState<ArticleWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `/api/search?search=${encodeURIComponent(searchQuery)}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setResults(data.results || []);
      } catch (error) {
        console.error("Error fetching search results:", error);
        setError("An error occurred while searching. Please try again.");
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    if (searchQuery.trim()) {
      fetchResults();
    } else {
      setResults([]);
      setLoading(false);
    }
  }, [searchQuery]);

  if (loading) {
    return (
      <MainLayout isAuthenticated={true}>
        <div className="bg-slate-50 py-8 min-h-screen">
          <div className="ut-container">
            <Card>
              <CardContent className="flex justify-center items-center h-32">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 animate-pulse" />
                  <p>Searching...</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout isAuthenticated={true}>
      <div className="bg-slate-50 py-8 min-h-screen">
        <div className="ut-container">
          <h1 className="text-2xl font-bold mb-6">
            {searchQuery
              ? `Search Results for "${searchQuery}"`
              : "Search Results"}
          </h1>

          {error ? (
            <Card>
              <CardContent className="flex justify-center items-center h-32 text-red-500">
                <p>{error}</p>
              </CardContent>
            </Card>
          ) : results.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-32 gap-2">
                <Search className="h-8 w-8 text-muted-foreground" />
                <p className="text-muted-foreground">No results found</p>
                <p className="text-sm text-muted-foreground">
                  Try different keywords or check your spelling
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  Found {results.length} result{results.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="grid gap-6">
                {results.map((result) => (
                  <Card key={result.id} className="overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      <div className="flex-grow p-6">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-1 bg-utred/10 text-utred text-xs rounded-full">
                            {result.type || "Article"}
                          </span>
                          <span className="text-sm text-gray-500 flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(result.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <Link href={`/article/${result.id}`} className="group">
                          <h3 className="text-xl font-semibold mb-2 group-hover:text-utred transition-colors">
                            {result.paper_name}
                          </h3>
                        </Link>

                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                          <div className="flex items-center text-gray-500">
                            <Users className="h-4 w-4 mr-1" />
                            <span>
                              {result.author
                                ? `${result.author.f_name} ${result.author.l_name}`
                                : "Unknown Author"}
                            </span>
                          </div>
                          <div className="flex items-center text-gray-500">
                            <BookOpen className="h-4 w-4 mr-1" />
                            <span>{result.type || "Article"}</span>
                          </div>
                        </div>

                        {result.keywords && result.keywords.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-4">
                            {result.keywords.map((keyword) => (
                              <span
                                key={keyword.id}
                                className="bg-utred/10 text-utred px-3 py-1 rounded-full text-sm"
                              >
                                {keyword.keyword}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="bg-gray-50 p-6 flex flex-col justify-center items-center md:w-48">
                        <div className="text-center mb-4">
                          <div className="text-2xl font-bold">0</div>
                          <div className="text-sm text-gray-500">Views</div>
                        </div>
                        <Button className="w-full flex items-center justify-center gap-2 bg-utred hover:bg-utred-dark">
                          <Download className="h-4 w-4" />
                          PDF
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
