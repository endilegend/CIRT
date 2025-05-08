"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Article, User, Keyword } from "@prisma/client";
import Link from "next/link";
import { BookOpen, Calendar, Users, Search, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ArticleWithRelations = Article & {
  author: User | null;
  keywords: Keyword[];
};

function ResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchQuery = searchParams.get("search") || "";
  const typeQuery = searchParams.get("type") || "";
  const yearQuery = searchParams.get("year") || "";
  const operatorQuery = searchParams.get("operator") || "AND";
  const [query, setQuery] = useState(searchQuery);
  const [selectedType, setSelectedType] = useState(typeQuery);
  const [selectedYear, setSelectedYear] = useState(yearQuery);
  const [searchOperator, setSearchOperator] = useState<"AND" | "OR">(
    operatorQuery as "AND" | "OR"
  );
  const [results, setResults] = useState<ArticleWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("newest");

  // Dynamic year options
  const currentYear = new Date().getFullYear();
  const yearOptions = [
    { value: currentYear.toString(), label: currentYear.toString() },
    {
      value: (currentYear - 1).toString(),
      label: (currentYear - 1).toString(),
    },
    {
      value: (currentYear - 2).toString(),
      label: (currentYear - 2).toString(),
    },
    { value: "older", label: "Before " + (currentYear - 2) },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.append("search", query.trim());
    if (selectedType) params.append("type", selectedType);
    if (selectedYear) params.append("year", selectedYear);
    params.append("operator", searchOperator);
    router.push(`/search/results?${params.toString()}`);
  };

  const handleDownload = async (article: ArticleWithRelations) => {
    try {
      const response = await fetch(article.pdf_path);
      if (!response.ok) throw new Error("Failed to fetch PDF");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${article.paper_name}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("Failed to download PDF. Please try again.");
    }
  };

  const sortResults = (results: ArticleWithRelations[], sortType: string) => {
    const sortedResults = [...results];
    switch (sortType) {
      case "newest":
        return sortedResults.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "oldest":
        return sortedResults.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case "author":
        return sortedResults.sort((a, b) => {
          const authorA = a.author
            ? `${a.author.l_name} ${a.author.f_name}`
            : "Unknown";
          const authorB = b.author
            ? `${b.author.l_name} ${b.author.f_name}`
            : "Unknown";
          return authorA.localeCompare(authorB);
        });
      case "popularity":
        return sortedResults.sort((a, b) => b.views - a.views);
      case "alphabetical":
        return sortedResults.sort((a, b) =>
          a.paper_name.localeCompare(b.paper_name)
        );
      default:
        return sortedResults;
    }
  };

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        setError(null);
        const params = new URLSearchParams();
        if (searchQuery.trim()) params.append("search", searchQuery.trim());
        if (typeQuery) params.append("type", typeQuery);
        if (yearQuery) params.append("year", yearQuery);
        params.append("operator", operatorQuery);
        params.append("status", "Approved");

        console.log("Fetching search results with params:", params.toString());
        const response = await fetch(`/api/search?${params.toString()}`);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error("Search API error:", {
            status: response.status,
            statusText: response.statusText,
            errorData,
          });
          throw new Error(
            errorData.error || `Search failed: ${response.statusText}`
          );
        }

        const data = await response.json();
        console.log("Search results:", data);
        setResults(data.results || []);
      } catch (error) {
        console.error("Error fetching search results:", error);
        setError(
          error instanceof Error
            ? error.message
            : "An error occurred while searching. Please try again."
        );
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    if (searchQuery.trim() || typeQuery || yearQuery) {
      fetchResults();
    } else {
      setResults([]);
      setLoading(false);
    }
  }, [searchQuery, typeQuery, yearQuery, operatorQuery]);

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
          {/* Search Box */}
          <div className="mb-8">
            <form
              onSubmit={handleSubmit}
              className="bg-white p-4 rounded-lg shadow-md"
            >
              <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-grow">
                    <Input
                      placeholder="Search by title, author, keywords..."
                      className="w-full"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="bg-utred hover:bg-utred-dark"
                  >
                    Search
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Article Type</Label>
                    <select
                      id="type"
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2"
                    >
                      <option value="">All Types</option>
                      <option value="Article">Article</option>
                      <option value="Journal">Journal</option>
                      <option value="Poster">Poster</option>
                      <option value="Paper">Paper</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="year">Publication Year</Label>
                    <select
                      id="year"
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2"
                    >
                      <option value="">All Years</option>
                      {yearOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <Label>Search Operator</Label>
                    <div className="flex gap-4 mt-1">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="operator"
                          value="AND"
                          checked={searchOperator === "AND"}
                          onChange={(e) =>
                            setSearchOperator(e.target.value as "AND" | "OR")
                          }
                          className="h-4 w-4"
                        />
                        <span>AND (all terms must match)</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="operator"
                          value="OR"
                          checked={searchOperator === "OR"}
                          onChange={(e) =>
                            setSearchOperator(e.target.value as "AND" | "OR")
                          }
                          className="h-4 w-4"
                        />
                        <span>OR (any term can match)</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>

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
                <div className="flex items-center gap-2">
                  <Label htmlFor="sort">Sort by:</Label>
                  <select
                    id="sort"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="rounded-md border border-input bg-background px-3 py-2"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="author">Author (A-Z)</option>
                    <option value="popularity">Most Popular</option>
                    <option value="alphabetical">Title (A-Z)</option>
                  </select>
                </div>
              </div>
              <div className="grid gap-6">
                {sortResults(results, sortBy).map((result) => (
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
                          <div className="text-2xl font-bold">
                            {result.views}
                          </div>
                          <div className="text-sm text-gray-500">Views</div>
                        </div>
                        <Button
                          onClick={() => handleDownload(result)}
                          className="w-full flex items-center justify-center gap-2 bg-utred hover:bg-utred-dark"
                        >
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

export default function ResultsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResultsContent />
    </Suspense>
  );
}
