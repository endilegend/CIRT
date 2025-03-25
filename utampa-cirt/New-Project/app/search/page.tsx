"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

// Sample article data - in a real app, this would come from your database
const articles = [
  {
    id: "1",
    title: "The Impact of Community Policing on Urban Crime Rates",
    author: "Dr. Sarah Johnson",
    publicationDate: "March 10, 2025",
    abstract:
      "This study examines the effectiveness of community policing strategies in major metropolitan areas over a five-year period. Using a mixed-methods approach, we analyze crime statistics from 15 urban centers before and after the implementation of various community policing initiatives.",
    journal: "Journal of Criminal Justice",
    volume: "48",
    issue: "2",
    type: "Article",
    keywords: ["community policing", "crime reduction", "urban crime"],
  },
  {
    id: "2",
    title: "Digital Forensics in Modern Criminal Investigations",
    author: "Prof. Michael Rodriguez",
    publicationDate: "February 28, 2025",
    abstract:
      "This article explores the evolution of digital forensic techniques and their application in solving complex criminal cases. We review advancements in data recovery, network analysis, and mobile device forensics over the past decade.",
    journal: "Digital Criminology Quarterly",
    volume: "37",
    issue: "1",
    type: "Journal",
    keywords: ["digital forensics", "cybercrime", "criminal investigation"],
  },
  {
    id: "3",
    title: "Juvenile Delinquency Prevention Programs: A Comparative Study",
    author: "Dr. Emily Chen",
    publicationDate: "February 15, 2025",
    abstract:
      "This paper presents a comparative analysis of juvenile delinquency prevention programs across different socioeconomic contexts. Drawing on data from 28 programs implemented in urban, suburban, and rural communities.",
    journal: "Youth and Society",
    volume: "57",
    issue: "3",
    type: "Paper",
    keywords: ["juvenile delinquency", "prevention programs", "at-risk youth"],
  },
];

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);

  // Get all unique keywords from the articles
  const allKeywords = Array.from(
    new Set(articles.flatMap((article) => article.keywords))
  );

  // Get all unique article types
  const articleTypes = Array.from(
    new Set(articles.map((article) => article.type))
  );

  // Filter articles based on search term, type, and keywords
  const filteredArticles = articles.filter((article) => {
    const matchesSearchTerm =
      searchTerm === "" ||
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.abstract.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.author.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType =
      selectedType === null || article.type === selectedType;

    const matchesKeywords =
      selectedKeywords.length === 0 ||
      selectedKeywords.some((keyword) =>
        article.keywords.includes(keyword)
      );

    return matchesSearchTerm && matchesType && matchesKeywords;
  });

  const toggleKeyword = (keyword: string) => {
    setSelectedKeywords((prevKeywords) =>
      prevKeywords.includes(keyword)
        ? prevKeywords.filter((k) => k !== keyword)
        : [...prevKeywords, keyword]
    );
  };

  return (
    <MainLayout>
      <div className="ut-container py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Search Database</h1>
          <p className="text-gray-600 mb-6">
            Search our comprehensive database of criminology research, publications, and academic resources.
          </p>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                type="search"
                placeholder="Search by title, author, or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Button className="bg-utred" onClick={() => setSearchTerm("")}>
              Search
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            <span className="text-gray-700 mr-2">Filter by type:</span>
            <Badge
              variant={selectedType === null ? "default" : "outline"}
              onClick={() => setSelectedType(null)}
              className="cursor-pointer"
            >
              All
            </Badge>
            {articleTypes.map((type) => (
              <Badge
                key={type}
                variant={selectedType === type ? "default" : "outline"}
                onClick={() => setSelectedType(type)}
                className="cursor-pointer"
              >
                {type}
              </Badge>
            ))}
          </div>

          <div className="mb-6">
            <span className="text-gray-700 block mb-2">Filter by keywords:</span>
            <div className="flex flex-wrap gap-2">
              {allKeywords.map((keyword) => (
                <Badge
                  key={keyword}
                  variant={selectedKeywords.includes(keyword) ? "default" : "outline"}
                  onClick={() => toggleKeyword(keyword)}
                  className="cursor-pointer"
                >
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-semibold">
            {filteredArticles.length} Results
          </h2>
        </div>

        <div className="space-y-6">
          {filteredArticles.map((article) => (
            <Card key={article.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <Link href={`/article/${article.id}`}>
                  <CardTitle className="text-xl hover:text-utred">
                    {article.title}
                  </CardTitle>
                </Link>
                <CardDescription>
                  <span className="text-utred">{article.type}</span> • {article.author} • {article.publicationDate}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-gray-700">{article.abstract}</p>
                <div className="flex flex-wrap gap-2">
                  {article.keywords.map((keyword) => (
                    <Badge key={keyword} variant="secondary" className="bg-gray-100">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-gray-500">
                  {article.journal} • Volume {article.volume}, Issue {article.issue}
                </div>
                <Link href={`/article/${article.id}`}>
                  <Button variant="outline" className="text-utred border-utred hover:bg-utred/10">
                    View Details
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
