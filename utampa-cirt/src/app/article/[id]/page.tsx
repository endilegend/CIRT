"use client";

import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Calendar, Users } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function ArticlePage({
  params,
}: {
  params: { id: string };
}) {
  const article = await prisma.article.findUnique({
    where: { id: parseInt(params.id) },
    include: { author: true, keywords: true },
  });

  if (!article) {
    return (
      <MainLayout isAuthenticated={true}>
        <div className="bg-slate-50 py-8 min-h-screen">
          <div className="ut-container">
            <Card>
              <CardHeader>
                <CardTitle>Article Not Found</CardTitle>
              </CardHeader>
              <CardContent>
                <p>The requested article could not be found.</p>
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
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{article.paper_name}</CardTitle>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center text-gray-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(article.createdAt).toLocaleDateString()}
                </div>
                <div className="flex items-center text-gray-500">
                  <Users className="h-4 w-4 mr-1" />
                  {article.author
                    ? `${article.author.f_name} ${article.author.l_name}`
                    : "Unknown Author"}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {article.keywords.map((keyword) => (
                  <span
                    key={keyword.id}
                    className="px-2 py-1 bg-utred/10 text-utred text-xs rounded-full"
                  >
                    {keyword.keyword}
                  </span>
                ))}
              </div>
              <div className="flex gap-4 mb-6">
                <Link href={`/Articles?page=${article.pdf_path}`}>
                  <Button className="bg-utred hover:bg-utred-dark">
                    <BookOpen className="h-4 w-4 mr-2" />
                    View PDF
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
