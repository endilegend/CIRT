"use client";

import React, { useState, useRef, useEffect } from "react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AreaChart, BookOpen, FileUp, PlusCircle, Search } from "lucide-react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Article, Keyword } from "@prisma/client";

// -----------------------------------------------------------------------------
// SAMPLE DATA & HELPERS
// -----------------------------------------------------------------------------

const myPublications = [
  {
    id: 1,
    title: "The Impact of Community Policing on Urban Crime Rates",
    type: "Article",
    date: "Mar 10, 2025",
    status: "Approved",
  },
  {
    id: 2,
    title: "Juvenile Delinquency Prevention Programs: A Comparative Study",
    type: "Paper",
    date: "Feb 15, 2025",
    status: "Under Review",
  },
  {
    id: 3,
    title:
      "Technology in Law Enforcement: Current Trends and Future Applications",
    type: "Poster",
    date: "Jan 22, 2025",
    status: "Sent",
  },
];

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

// -----------------------------------------------------------------------------
// DRAG & DROP COMPONENT
// -----------------------------------------------------------------------------

interface DragDropFileProps {
  onFileSelect: (file: File) => void;
}

function DragDropFile({ onFileSelect }: DragDropFileProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div
      className={`border-2 rounded-lg border-dashed p-8 text-center cursor-pointer ${
        isDragging ? "border-utred" : "border-gray-300"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        type="file"
        accept="application/pdf"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <div className="mx-auto flex flex-col items-center justify-center gap-4">
        <FileUp className="h-10 w-10 text-gray-400" />
        <p className="text-lg font-medium mb-1">Drag and drop your PDF here</p>
        <p className="text-sm text-gray-500 mb-4">or click to browse files</p>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// UPLOAD FORM (DIALOG) COMPONENT
// -----------------------------------------------------------------------------

interface UploadFormProps {
  file: File | null;
}

function UploadForm({ file }: UploadFormProps) {
  const [paperName, setPaperName] = useState("");
  const [type, setType] = useState("Article");
  const [keywords, setKeywords] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a PDF file first.");
      return;
    }

    // Get the current Firebase user and ensure they're authenticated
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      alert("User not authenticated");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("name", paperName);
      formData.append("type", type);
      formData.append("keywords", keywords);
      formData.append("author_id", user.uid);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        console.error("Upload error:", data.error);
        alert("Error uploading file: " + data.error);
        return;
      }

      console.log("Upload successful:", data);
      alert("Upload successful!");
      // Optionally reset fields or close dialog
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed. Check console for details.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      {file && (
        <div className="text-sm text-gray-600">
          <strong>Selected File:</strong> {file.name}
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="article-type">Type</Label>
        <select
          id="article-type"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-utred focus:border-utred"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="Article">Article</option>
          <option value="Journal">Journal</option>
          <option value="Poster">Poster</option>
          <option value="Paper">Paper</option>
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="keywords">Keywords (comma-separated)</Label>
        <Input
          id="keywords"
          placeholder="e.g., criminology, research, policy"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="paperName">Name</Label>
        <Input
          id="paperName"
          placeholder="Enter Name"
          value={paperName}
          onChange={(e) => setPaperName(e.target.value)}
        />
      </div>
      <Button type="submit" className="bg-utred hover:bg-utred-dark">
        Submit
      </Button>
    </form>
  );
}

// -----------------------------------------------------------------------------
// MAIN DASHBOARD PAGE
// -----------------------------------------------------------------------------

export default function DashboardPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [userPublications, setUserPublications] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [publicationsCount, setPublicationsCount] = useState(0);
  const [totalApprovedCount, setTotalApprovedCount] = useState(0);
  const [assignedArticlesCount, setAssignedArticlesCount] = useState(0);
  const [sentArticlesCount, setSentArticlesCount] = useState(0);

  const fetchTotalApprovedCount = async () => {
    try {
      const response = await fetch("/api/publications/count");
      if (!response.ok) {
        throw new Error("Failed to fetch total count");
      }
      const data = await response.json();
      setTotalApprovedCount(data.count);
    } catch (error) {
      console.error("Error fetching total count:", error);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch("/api/dashboard/stats");
      if (!response.ok) {
        throw new Error("Failed to fetch dashboard stats");
      }
      const data = await response.json();
      setAssignedArticlesCount(data.assignedArticlesCount);
      setSentArticlesCount(data.sentArticlesCount);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  };

  const fetchUserPublications = async (userId: string) => {
    try {
      const response = await fetch(`/api/user/publications?userId=${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch publications");
      }

      const data = await response.json();
      setUserPublications(data.publications);
      setPublicationsCount(data.publications.length);
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
        fetchTotalApprovedCount();
        fetchDashboardStats();
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
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-600">
              Welcome to your CIRT database dashboard.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium">
                  My Publications
                </CardTitle>
                <BookOpen className="h-5 w-5 text-utred" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{publicationsCount}</div>
                <p className="text-sm text-gray-600">
                  Total publications in database
                </p>
                <br></br>
              </CardContent>
              <CardFooter>
                <Link href="/dashboard/userpublications">
                  <Button
                    variant="ghost"
                    className="text-utred hover:text-utred-dark"
                  >
                    View All
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium">
                  Review Submissions
                </CardTitle>
                <BookOpen className="h-5 w-5 text-utred" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {assignedArticlesCount}
                </div>
                <p className="text-sm text-gray-600">
                  Total articles assigned for review
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/dashboard/review">
                  <Button
                    variant="ghost"
                    className="text-utred hover:text-utred-dark"
                  >
                    View Submissions
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium">
                  Edit Submissions
                </CardTitle>
                <AreaChart className="h-5 w-5 text-utred" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{sentArticlesCount}</div>
                <p className="text-sm text-gray-600">
                  Total articles with status "Sent"
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/dashboard/editor">
                  <Button
                    variant="ghost"
                    className="text-utred hover:text-utred-dark"
                  >
                    View Submissions
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium">
                  Database Status
                </CardTitle>
                <Search className="h-5 w-5 text-utred" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totalApprovedCount}</div>
                <p className="text-sm text-gray-600">
                  Total approved publications in system
                </p>
                <br></br>
              </CardContent>
              <CardFooter>
                <Link href="/search">
                  <Button
                    variant="ghost"
                    className="text-utred hover:text-utred-dark"
                  >
                    Search Database
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>

          {/* Upload Section */}
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Upload New Article</CardTitle>
                <CardDescription>
                  Upload your latest research to share with the CIRT community
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DragDropFile onFileSelect={(file) => setSelectedFile(file)} />
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-gray-500">
                  Maximum file size: 10MB
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      className="bg-utred hover:bg-utred-dark"
                      disabled={!selectedFile}
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Upload Article
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Article Details</DialogTitle>
                      <DialogDescription>
                        Provide metadata for your publication
                      </DialogDescription>
                    </DialogHeader>
                    <UploadForm file={selectedFile} />
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          </div>

          {/* Recent Publications */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>My Recent Publications</CardTitle>
                  <CardDescription>
                    View and manage your recent submissions
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-4">Loading publications...</div>
              ) : error ? (
                <div className="text-center text-red-500 py-4">{error}</div>
              ) : userPublications.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  No publications yet. Use the upload section above to add one.
                </div>
              ) : (
                <div className="scrollable-table">
                  <Table>
                    <TableHeader className="sticky top-0 bg-white z-10">
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
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
                          <TableCell>
                            <Link
                              href={`/article/${publication.id}`}
                              className="text-utred hover:underline"
                            >
                              View
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
