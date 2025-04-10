"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
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
import { Article } from "@prisma/client";

function getStatusClass(status: string) {
  switch (status) {
    case "Approved":
      return "px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full";
    case "Under Review":
      return "px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full";
    case "Sent":
      return "px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full";
    case "Declined":
      return "px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full";
    default:
      return "px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full";
  }
}

export default function UserPublicationsPage() {
  const [userPublications, setUserPublications] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  const fetchUserPublications = async (userId: string) => {
    try {
      const response = await fetch(`/api/user/publications?userId=${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch publications");
      }

      const data = await response.json();
      setUserPublications(data.publications);
      setError(null);
    } catch (error) {
      console.error("Error fetching publications:", error);
      setError("Failed to load publications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const auth = getAuth();

    // Set up auth state listener
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthChecked(true);

      if (user) {
        fetchUserPublications(user.uid);
      } else {
        setError("User not authenticated");
        setLoading(false);
      }
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  // Show loading state while checking auth
  if (!authChecked) {
    return (
      <MainLayout isAuthenticated={true}>
        <div className="bg-slate-50 min-h-screen py-8">
          <div className="ut-container">
            <div className="flex justify-center items-center h-32">
              <p>Loading...</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout isAuthenticated={true}>
      <div className="bg-slate-50 py-8 min-h-screen">
        <div className="ut-container">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold">My Publications</h1>
            <p className="text-gray-600">View and manage your publications</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>My Publications</CardTitle>
              <CardDescription className="text-right font-bold text-gray-700">
                Number of publications: {userPublications.length}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-4">Loading publications...</div>
              ) : error ? (
                <div className="text-center text-red-500 py-4">{error}</div>
              ) : userPublications.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  No publications found. Use the upload section to add one.
                </div>
              ) : (
                <div className="scrollable-table">
                  <Table>
                    <TableHeader className="sticky top-0 bg-white z-10">
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Date Uploaded</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {userPublications.map((publication) => (
                        <TableRow key={publication.id}>
                          <TableCell className="font-medium">
                            {publication.paper_name}
                          </TableCell>
                          <TableCell>{publication.type}</TableCell>
                          <TableCell>
                            {new Date(
                              publication.createdAt
                            ).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <span
                              className={getStatusClass(
                                publication.status || "Sent"
                              )}
                            >
                              {publication.status || "Sent"}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Link href={`/article/${publication.id}`}>
                              <Button className="hover:text-utred" size="sm">
                                View
                              </Button>
                            </Link>
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
