"use client";

import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { Article, User, Keyword } from "@prisma/client";
import { Calendar, Users } from "lucide-react";

type ArticleWithRelations = Article & {
  author: User | null;
  keywords: Keyword[];
};

export default function HomePage() {
  // Track auth state so we can conditionally show buttons
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [articles, setArticles] = useState<ArticleWithRelations[]>([]);
  const [featuredArticles, setFeaturedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const [articlesRes, featuredRes] = await Promise.all([
          fetch("/api/articles"),
          fetch("/api/articles/featured"),
        ]);

        if (!articlesRes.ok || !featuredRes.ok) {
          throw new Error("Failed to fetch articles");
        }

        const [articlesData, featuredData] = await Promise.all([
          articlesRes.json(),
          featuredRes.json(),
        ]);

        setArticles(articlesData || []);
        setFeaturedArticles(featuredData.articles || []);
      } catch (error) {
        console.error("Error fetching articles:", error);
        setArticles([]);
        setFeaturedArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-utblack to-utblack-light text-white py-20">
        <div className="ut-container">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2 space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Welcome to the{" "}
                <span className="text-utred">Criminology Institute</span> for
                Research and Training
              </h1>
              <p className="text-xl text-gray-200">
                Explore our comprehensive database of criminology research,
                publications, and academic resources.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/search">
                  <Button className="bg-utred hover:bg-utred-dark text-white py-2 px-6 rounded-md text-lg">
                    Search Database
                  </Button>
                </Link>
                {isLoggedIn ? (
                  <Link href="/dashboard">
                    <Button
                      variant="outline"
                      className="border-white text-black hover:bg-gray-300 py-2 px-6 rounded-md text-lg"
                    >
                      Dashboard
                    </Button>
                  </Link>
                ) : (
                  <Link href="/register">
                    <Button
                      variant="outline"
                      className="border-white text-black hover:bg-gray-300 py-2 px-6 rounded-md text-lg"
                    >
                      Register Account
                    </Button>
                  </Link>
                )}
              </div>
            </div>
            <div className="md:w-1/2 relative h-64 md:h-96 w-full">
              <Image
                src="/images/ut-plant-hall.jpg"
                alt="University of Tampa Plant Hall"
                fill
                className="object-cover rounded-lg shadow-lg"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-slate-50">
        <div className="ut-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Database Features</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform provides researchers, students, and faculty with
              powerful tools to explore criminology research.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-t-4 border-t-utred">
              <CardHeader>
                <CardTitle>Academic Publications</CardTitle>
                <CardDescription>
                  Access peer-reviewed articles and journals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Browse through our extensive collection of peer-reviewed
                  articles, journals, and academic papers in the field of
                  criminology.
                </p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-utred">
              <CardHeader>
                <CardTitle>Research Repository</CardTitle>
                <CardDescription>
                  Upload and share your research
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Contribute to the academic community by uploading your
                  research papers, posters, and findings for others to reference
                  and build upon.
                </p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-utred">
              <CardHeader>
                <CardTitle>Advanced Search</CardTitle>
                <CardDescription>Find exactly what you need</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Our powerful search functionality allows you to filter by
                  keywords, authors, publication date, and more to find relevant
                  resources.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Articles Section */}
      <section className="py-16 bg-gray-50">
        <div className="ut-container">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Articles</h2>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-32">
              <p>Loading featured articles...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredArticles.slice(0, 6).map((article) => (
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

                      <Link href={`/article/${article.id}`} className="group">
                        <h3 className="text-xl font-semibold mb-2 group-hover:text-utred transition-colors">
                          {article.paper_name}
                        </h3>
                      </Link>

                      <div className="flex items-center text-gray-500 text-sm">
                        <Users className="h-4 w-4 mr-1" />
                        <span>
                          {article.author
                            ? `${article.author.f_name} ${article.author.l_name}`
                            : "Unknown Author"}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Recent Articles */}
      <section className="py-16">
        <div className="ut-container">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Recent Contributions</h2>
            <Link href="/search">
              <Button
                variant="ghost"
                className="text-utred hover:text-utred-dark"
              >
                View All Articles
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-32">
              <p>Loading articles...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <Link
                  href={`/article/${article.id}`}
                  key={article.id}
                  className="block hover:no-underline"
                >
                  <Card className="hover:shadow-md transition-shadow h-full">
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-utred/10 text-utred text-xs rounded-full">
                          {article.type || "Article"}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(article.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <CardTitle className="text-lg group-hover:text-utred transition-colors">
                        {article.paper_name}
                      </CardTitle>
                      <CardDescription>
                        {article.author
                          ? `By ${article.author.f_name} ${article.author.l_name}`
                          : "Unknown Author"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {article.keywords && article.keywords.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {article.keywords.slice(0, 3).map((keyword) => (
                            <span
                              key={keyword.id}
                              className="bg-utred/10 text-utred px-2 py-0.5 rounded-full text-xs"
                            >
                              {keyword.keyword}
                            </span>
                          ))}
                          {article.keywords.length > 3 && (
                            <span className="text-xs text-gray-500">
                              +{article.keywords.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-utred text-white py-16">
        <div className="ut-container text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Contribute?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join our academic community and share your research with scholars
            around the world.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            {isLoggedIn ? (
              <Link href="/dashboard">
                <Button className="bg-white text-utred hover:bg-gray-300 hover:text-black py-2 px-6 rounded-md text-lg">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <Link href="/register">
                <Button className="bg-white text-utred hover:bg-gray-300 hover:text-black py-2 px-6 rounded-md text-lg">
                  Create Account
                </Button>
              </Link>
            )}
            <Link href="/about">
              <Button
                variant="outline"
                className="border-white text-utred hover:bg-gray-300 py-2 px-6 rounded-md text-lg"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
