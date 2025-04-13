"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  BookOpen,
  Calendar,
  Download,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { Article, User, Keyword } from "@prisma/client";

type ArticleWithRelations = Article & {
  author: User | null;
  keywords: Keyword[];
};

// Cache for storing fetched articles
type CachedData = {
  articles: ArticleWithRelations[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
};

const articleCache = new Map<string, CachedData>();

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [articles, setArticles] = useState<ArticleWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (query.trim()) {
        router.push(`/search/results?search=${encodeURIComponent(query)}`);
      }
    },
    [query, router]
  );

  const handleDownload = useCallback(async (article: ArticleWithRelations) => {
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
  }, []);

  const fetchArticles = useCallback(async (page: number = 1) => {
    const cacheKey = `articles-page-${page}`;

    // Check cache first
    if (articleCache.has(cacheKey)) {
      const cachedData = articleCache.get(cacheKey);
      if (cachedData) {
        setArticles(cachedData.articles);
        setTotalPages(cachedData.pagination.totalPages);
        setCurrentPage(cachedData.pagination.currentPage);
        setLoading(false);
        return;
      }
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/articles/approved?page=${page}`);
      if (!response.ok) {
        throw new Error("Failed to fetch articles");
      }
      const data = await response.json();

      // Cache the response
      articleCache.set(cacheKey, data);

      setArticles(data.articles);
      setTotalPages(data.pagination.totalPages);
      setCurrentPage(data.pagination.currentPage);
    } catch (error) {
      console.error("Error fetching articles:", error);
      setError("Failed to load articles");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const handlePageChange = useCallback(
    (newPage: number) => {
      if (newPage >= 1 && newPage <= totalPages) {
        fetchArticles(newPage);
      }
    },
    [fetchArticles, totalPages]
  );

  // Memoize the articles list to prevent unnecessary re-renders
  const memoizedArticles = useMemo(() => articles, [articles]);

  return (
    <MainLayout>
      <div className="bg-slate-50 min-h-screen py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Header */}
          <div className="mb-8 text-center max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">CIRT Database Search</h1>
            <p className="text-gray-600 mb-6">
              Search our comprehensive collection of criminology research,
              papers, journals, and more.
            </p>

            <div className="bg-white p-4 rounded-lg shadow-md">
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col md:flex-row gap-4 mb-4">
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
              </form>

              <div className="flex flex-wrap justify-center gap-4">
                <Button variant="outline" size="sm">
                  Advanced Search
                </Button>
                <select className="px-3 py-1 border border-gray-300 rounded-md text-sm">
                  <option value="">All Types</option>
                  <option value="Article">Articles</option>
                  <option value="Journal">Journals</option>
                  <option value="Poster">Posters</option>
                  <option value="Paper">Papers</option>
                </select>
                <select className="px-3 py-1 border border-gray-300 rounded-md text-sm">
                  <option value="">All Years</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                  <option value="older">2021 and older</option>
                </select>
              </div>
            </div>
          </div>

          {/* Popular Keywords */}
          <div className="mb-12">
            <h2 className="text-xl font-semibold mb-4">Popular Keywords</h2>
            <div className="flex flex-wrap gap-2">
              {popularKeywords.map((keyword, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="bg-white hover:bg-gray-100"
                  onClick={() => {
                    setQuery(keyword);
                    router.push(
                      `/search/results?search=${encodeURIComponent(keyword)}`
                    );
                  }}
                >
                  {keyword}
                </Button>
              ))}
            </div>
          </div>

          {/* Search Results */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Latest Articles</h2>
              <div className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-32">
                <p>Loading articles...</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-6 mb-8">
                  {memoizedArticles.map((article) => (
                    <Card key={article.id} className="overflow-hidden">
                      <div className="flex flex-col md:flex-row">
                        <div className="flex-grow p-6">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-1 bg-utred/10 text-utred text-xs rounded-full">
                              {article.type || "Article"}
                            </span>
                            <span className="text-sm text-gray-500 flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {new Date(article.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          <Link
                            href={`/article/${article.id}`}
                            className="group"
                          >
                            <h3 className="text-xl font-semibold mb-2 group-hover:text-utred transition-colors">
                              {article.paper_name}
                            </h3>
                          </Link>

                          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                            <div className="flex items-center text-gray-500">
                              <Users className="h-4 w-4 mr-1" />
                              <span>
                                {article.author
                                  ? `${article.author.f_name} ${article.author.l_name}`
                                  : "Unknown Author"}
                              </span>
                            </div>
                            <div className="flex items-center text-gray-500">
                              <BookOpen className="h-4 w-4 mr-1" />
                              <span>{article.type || "Article"}</span>
                            </div>
                          </div>

                          {article.keywords && article.keywords.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-4">
                              {article.keywords.map((keyword) => (
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
                              {article.views}
                            </div>
                            <div className="text-sm text-gray-500">Views</div>
                          </div>
                          <Button
                            onClick={() => handleDownload(article)}
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

                {/* Pagination Controls */}
                <div className="flex justify-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

// Keywords requested by client
const popularKeywords = [
  "Corrections",
  "Sentencing",
  "White Collar Crime",
  "Mental Health",
  "Victimology",
  "Criminal Theory",
  "Statistics",
  "Policing",
  "Crime Prevention",
  "Policy",
  "Sentencing",
  "Methodology",
];
