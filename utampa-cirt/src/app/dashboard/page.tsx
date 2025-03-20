"use client";

import React, { useState, useRef } from "react";
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
import { getAuth } from "firebase/auth";

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
    views: 47,
  },
  {
    id: 2,
    title: "Juvenile Delinquency Prevention Programs: A Comparative Study",
    type: "Paper",
    date: "Feb 15, 2025",
    status: "Under Review",
    views: 12,
  },
  {
    id: 3,
    title:
      "Technology in Law Enforcement: Current Trends and Future Applications",
    type: "Poster",
    date: "Jan 22, 2025",
    status: "Sent",
    views: 94,
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
  // This is a mocked authenticated page for demo purposes
  const isAuthenticated = true;
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  return (
    <MainLayout isAuthenticated={isAuthenticated}>
      <div className="bg-slate-50 py-8 min-h-screen">
        <div className="ut-container">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-600">
              Welcome to your CIRT database dashboard.
            </p>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium">
                  My Publications
                </CardTitle>
                <BookOpen className="h-5 w-5 text-utred" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">3</div>
                <p className="text-sm text-gray-600">
                  Total publications in database
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/dashboard/publications">
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
                  Publication Views
                </CardTitle>
                <AreaChart className="h-5 w-5 text-utred" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">153</div>
                <p className="text-sm text-gray-600">
                  Total views across all your publications
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/dashboard/analytics">
                  <Button
                    variant="ghost"
                    className="text-utred hover:text-utred-dark"
                  >
                    View Analytics
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
                <div className="text-3xl font-bold">324</div>
                <p className="text-sm text-gray-600">
                  Total publications in system
                </p>
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
                    <Button className="bg-utred hover:bg-utred-dark">
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
                    <DialogFooter></DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          </div>

          {/* Recent Publications Table */}
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle>My Recent Publications</CardTitle>
                <CardDescription>
                  View and manage your recent contributions to the CIRT database
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date Uploaded</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Views</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {myPublications.map((pub) => (
                      <TableRow key={pub.id}>
                        <TableCell className="font-medium">
                          {pub.title}
                        </TableCell>
                        <TableCell>{pub.type}</TableCell>
                        <TableCell>{pub.date}</TableCell>
                        <TableCell>
                          <span className={getStatusClass(pub.status)}>
                            {pub.status}
                          </span>
                        </TableCell>
                        <TableCell>{pub.views}</TableCell>
                        <TableCell className="text-right">
                          <Link href={`/dashboard/publications/${pub.id}`}>
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter>
                <Link href="/dashboard/publications">
                  <Button variant="outline">View All Publications</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
