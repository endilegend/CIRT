"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";
import Link from "next/link";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter, useSearchParams } from "next/navigation";

function ArticlesContent() {
  const isAuthenticated = true;
  const [pdfPath, setPdfPath] = useState<string>("");
  const searchParams = useSearchParams();

  useEffect(() => {
    const page = searchParams.get("page");
    if (page && page.trim() !== "") {
      // Extract just the filename from the full path
      const fileName = page.split("/").pop();
      setPdfPath(`/pdfs/${fileName}`);
    } else {
      setPdfPath("");
    }
  }, [searchParams]);

  return (
    <MainLayout isAuthenticated={isAuthenticated}>
      <div className="bg-slate-50 py-8 min-h-screen">
        <div className="ut-container flex justify-center items-center h-[100vh]">
          <div className="w-3/4 h-full bg-white rounded-lg shadow-lg overflow-hidden">
            {pdfPath ? (
              <iframe
                src={pdfPath}
                width="100%"
                height="100%"
                allowFullScreen
                className="rounded-lg"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">No PDF selected</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default function ArticlesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ArticlesContent />
    </Suspense>
  );
}
