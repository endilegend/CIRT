"use client";

import React, { useEffect, useState } from "react";
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
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Link from "next/link";
import { Article, Status } from "@prisma/client";

const getStatusColor = (status: Status | null) => {
  switch (status) {
    case "Sent":
      return "bg-blue-200 text-blue-800";
    case "Under_Review":
      return "bg-yellow-200 text-yellow-800";
    case "Reviewed":
      return "bg-orange-200 text-orange-800";
    case "Declined":
      return "bg-red-200 text-red-800";
    case "Approved":
      return "bg-green-200 text-green-800";
    default:
      return "bg-gray-200 text-gray-800";
  }
};

export default function UserPublicationsPage() {
  const [publications, setPublications] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchPublications = async () => {
      if (!userId) return;

      try {
        const response = await fetch(`/api/user/publications?userId=${userId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch publications");
        }
        const data = await response.json();
        setPublications(data.publications);
      } catch (error) {
        console.error("Error:", error);
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchPublications();
    }
  }, [userId]);

  return (
    <MainLayout isAuthenticated={!!userId}>
      <div className="bg-slate-50 py-8 min-h-screen">
        <div className="ut-container">
          <Card>
            <CardHeader>
              <CardTitle>My Publications</CardTitle>
              <CardDescription>
                View and manage your submitted articles
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-4">Loading...</div>
              ) : error ? (
                <div className="text-center text-red-500 py-4">{error}</div>
              ) : publications.length === 0 ? (
                <div className="text-center py-4">No publications found</div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {publications.map((publication) => (
                        <TableRow key={publication.id}>
                          <TableCell>{publication.paper_name}</TableCell>
                          <TableCell>{publication.type}</TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                publication.status
                              )}`}
                            >
                              {publication.status?.replace("_", " ") ||
                                "Unknown"}
                            </span>
                          </TableCell>
                          <TableCell>
                            {new Date(
                              publication.createdAt
                            ).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm" asChild>
                              <Link
                                href={`/dashboard/author/${publication.id}`}
                              >
                                View
                              </Link>
                            </Button>
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
    </MainLayout>
  );
}
