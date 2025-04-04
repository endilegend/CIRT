import { MainLayout } from "@/components/layout/MainLayout";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, BookOpen, Download, Users } from "lucide-react";

// This page is a server component.
// It receives search parameters via its props.
export default async function ResultsPage({
  searchParams,
}: {
  searchParams: { search?: string };
}) {
  const searchQuery = searchParams.search || "";

  // Call the internal API endpoint for search.
  const res = await fetch(
    `http://localhost:3000/api/search?search=${encodeURIComponent(
      searchQuery
    )}`,
    {
      cache: "no-store",
    }
  );
  const data = await res.json();
  const results = data.results || [];

  return (
    <MainLayout>
      <div className="bg-slate-50 min-h-screen py-8">
        <div className="ut-container">
          <h1 className="text-3xl font-bold mb-4">
            Search Results for "{searchQuery}"
          </h1>
          <div className="grid grid-cols-1 gap-6 mb-8">
            {results.map((result: any) => (
              <Card key={result.id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="flex-grow p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-utred/10 text-utred text-xs rounded-full">
                        {result.type}
                      </span>
                      <span className="text-sm text-gray-500 flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {result.createdAt
                          ? new Date(result.createdAt).toLocaleDateString()
                          : "Unknown"}
                      </span>
                    </div>
                    <Link href={`/article/${result.id}`} className="group">
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-utred transition-colors">
                        {result.paper_name}
                      </h3>
                    </Link>
                    <p className="text-gray-600 mb-4">
                      {result.abstract || "No abstract provided."}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                      <div className="flex items-center text-gray-500">
                        <Users className="h-4 w-4 mr-1" />
                        <span>
                          {result.author
                            ? `${result.author.f_name} ${result.author.l_name}`
                            : "Unknown"}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-500">
                        <BookOpen className="h-4 w-4 mr-1" />
                        <span>{result.citations || 0} Citations</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-6 flex flex-col justify-center items-center md:w-48">
                    <div className="text-center mb-4">
                      <div className="text-2xl font-bold">
                        {result.views || 0}
                      </div>
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
          {/* Pagination (if needed) */}
          <div className="flex justify-center gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-utred text-white hover:bg-utred-dark"
            >
              1
            </Button>
            <Button variant="outline" size="sm">
              2
            </Button>
            <Button variant="outline" size="sm">
              3
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
