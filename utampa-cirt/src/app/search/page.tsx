"use client";

import { useState } from "react";
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
import { BookOpen, Calendar, Download, Users } from "lucide-react";
import Link from "next/link";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search/results?search=${encodeURIComponent(query)}`);
    }
  };

  return (
    <MainLayout>
      <div className="bg-slate-50 min-h-screen py-8">
        <div className="ut-container">
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
              <h2 className="text-xl font-semibold">Search Results</h2>
              <div className="text-sm text-gray-600">
                Showing {searchResults.length} of 324 results
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 mb-8">
              {searchResults.map((result) => (
                <Card key={result.id} className="overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="flex-grow p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-utred/10 text-utred text-xs rounded-full">
                          {result.type}
                        </span>
                        <span className="text-sm text-gray-500 flex items-center">
                          <Calendar className="h-3 w-3 mr-1" /> {result.date}
                        </span>
                      </div>

                      <Link href={`/article/${result.id}`} className="group">
                        <h3 className="text-xl font-semibold mb-2 group-hover:text-utred transition-colors">
                          {result.title}
                        </h3>
                      </Link>

                      <p className="text-gray-600 mb-4">{result.abstract}</p>

                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                        <div className="flex items-center text-gray-500">
                          <Users className="h-4 w-4 mr-1" />
                          <span>{result.authors.join(", ")}</span>
                        </div>
                        <div className="flex items-center text-gray-500">
                          <BookOpen className="h-4 w-4 mr-1" />
                          <span>{result.citations} Citations</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-6 flex flex-col justify-center items-center md:w-48">
                      <div className="text-center mb-4">
                        <div className="text-2xl font-bold">{result.views}</div>
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

            {/* Pagination */}
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
      </div>
    </MainLayout>
  );
}

// Sample data
const popularKeywords = [
  "Criminal Justice",
  "Policing",
  "Juvenile Delinquency",
  "Criminology Theory",
  "Corrections",
  "Law Enforcement",
  "Social Justice",
  "Crime Prevention",
  "Forensics",
  "Rehabilitation",
];

const searchResults = [
  {
    id: 1,
    title: "The Impact of Community Policing on Urban Crime Rates",
    type: "Article",
    date: "March 10, 2025",
    abstract:
      "This study examines the effectiveness of community policing strategies in major metropolitan areas over a five-year period. Results indicate that community engagement significantly reduces violent crime rates when implemented consistently.",
    authors: ["Dr. Sarah Johnson", "Prof. Michael Chen"],
    citations: 12,
    views: 247,
  },
  {
    id: 2,
    title: "Digital Forensics in Modern Criminal Investigations",
    type: "Journal",
    date: "February 28, 2025",
    abstract:
      "An analysis of how digital forensic techniques have evolved and their application in solving complex cases. This research explores modern methodologies and their effectiveness compared to traditional investigative approaches.",
    authors: ["Prof. Michael Rodriguez", "Dr. Lisa Wang"],
    citations: 8,
    views: 183,
  },
  {
    id: 3,
    title: "Juvenile Delinquency Prevention Programs: A Comparative Study",
    type: "Paper",
    date: "February 15, 2025",
    abstract:
      "This paper compares the effectiveness of various prevention programs targeting at-risk youth across different socioeconomic backgrounds. Our findings suggest that early intervention produces the most significant long-term positive outcomes.",
    authors: ["Dr. Emily Chen", "Prof. David Williams"],
    citations: 5,
    views: 129,
  },
  {
    id: 4,
    title: "The Evolution of Corrections Facilities: Design and Rehabilitation",
    type: "Article",
    date: "January 22, 2025",
    abstract:
      "An examination of how correctional facility design has evolved to support rehabilitation goals. This study analyzes architectural trends and their impact on inmate behavior and recidivism rates.",
    authors: ["Dr. James Peterson", "Dr. Maria Gonzalez"],
    citations: 15,
    views: 342,
  },
];
