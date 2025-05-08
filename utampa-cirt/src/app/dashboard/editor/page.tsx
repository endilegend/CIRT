"use client";

import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import DeleteCard from "@/components/delete/DeleteCard";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { Article, User, Role } from "@prisma/client";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

type ArticleWithAuthor = Article & {
  author: User;
  featured: boolean;
};

type UserSuggestion = {
  id: string;
  f_name: string;
  l_name: string;
  email: string;
  user_role: Role;
};

type UserWithRole = {
  id: string;
  f_name: string;
  l_name: string;
  email: string;
  user_role: Role;
};

export default function EditorPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<ArticleWithAuthor[]>([]);
  const [approvedArticles, setApprovedArticles] = useState<ArticleWithAuthor[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editorQueries, setEditorQueries] = useState<{ [key: string]: string }>(
    {}
  );
  const [submitted, setSubmitted] = useState<{ [key: string]: boolean }>({});
  const [filteredSuggestions, setFilteredSuggestions] = useState<{
    [key: string]: UserSuggestion[];
  }>({});
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [featuredSearchQuery, setFeaturedSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<{ [key: string]: string }>(
    {}
  );
  const [selectedReviewers, setSelectedReviewers] = useState<{
    [key: string]: string;
  }>({});
  const [authChecked, setAuthChecked] = useState(false);

  const fetchUsers = async (page: number, query: string = "") => {
    setLoadingUsers(true);
    try {
      const response = await fetch(
        `/api/users/list?page=${page.toString()}&query=${encodeURIComponent(
          query
        )}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setUsers(data.users as UserWithRole[]);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchArticles = async () => {
    try {
      const [sentRes, approvedRes] = await Promise.all([
        fetch("/api/articles/sent"),
        fetch("/api/articles/approved"),
      ]);

      if (!sentRes.ok || !approvedRes.ok) {
        throw new Error("Failed to fetch articles");
      }

      const [sentData, approvedData] = await Promise.all([
        sentRes.json(),
        approvedRes.json(),
      ]);

      setArticles(sentData.articles);
      setApprovedArticles(approvedData.articles);
      setError(null);
    } catch (error) {
      console.error("Error fetching articles:", error);
      setError("Failed to load articles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setAuthChecked(true);

      if (user) {
        try {
          const response = await fetch(`/api/user/role?userId=${user.uid}`);
          const data = await response.json();

          if (response.ok) {
            if (data.role !== "Editor") {
              router.push("/dashboard");
              return;
            }
            // If user is an editor, fetch the articles
            fetchArticles();
          } else {
            setError(data.error || "Something went wrong.");
          }
        } catch (err) {
          setError("Failed to verify role.");
          console.error(err);
        }
      } else {
        router.push("/register");
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    fetchUsers(1);
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

  const handleInputChange = async (id: number, value: string) => {
    setEditorQueries((prev) => ({ ...prev, [id.toString()]: value }));

    if (!value.trim()) {
      setFilteredSuggestions((prev) => ({ ...prev, [id.toString()]: [] }));
      return;
    }

    try {
      const response = await fetch(
        `/api/users/search?query=${encodeURIComponent(value)}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setFilteredSuggestions((prev) => ({
        ...prev,
        [id.toString()]: data.users,
      }));
    } catch (error) {
      console.error("Error fetching user suggestions:", error);
      setFilteredSuggestions((prev) => ({ ...prev, [id.toString()]: [] }));
    }
  };

  const handleSubmit = async (
    e?: React.FormEvent<HTMLFormElement> | React.MouseEvent,
    articleId?: number,
    userId?: string
  ) => {
    if (e) {
      e.preventDefault();
    }
    if (!userId || !articleId) return;

    try {
      const response = await fetch(`/api/articles/${articleId}/assign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error("Failed to assign editor");
      }

      setSubmitted((prev) => ({ ...prev, [articleId.toString()]: true }));
      setEditorQueries((prev) => ({ ...prev, [articleId.toString()]: "" }));
      setFilteredSuggestions((prev) => ({
        ...prev,
        [articleId.toString()]: [],
      }));
      // Clear the selected reviewer after successful submission
      setSelectedReviewers((prev) => {
        const updated = { ...prev };
        delete updated[articleId.toString()];
        return updated;
      });
    } catch (error) {
      console.error("Error assigning editor:", error);
      alert("Failed to assign editor. Please try again.");
    }
  };

  const handleUserSearch = (value: string) => {
    setUserSearchQuery(value);
    setCurrentPage(1);
    fetchUsers(1, value);
  };

  const handleRoleSelect = (userId: string, role: string) => {
    // Ensure the role matches the enum value exactly
    const validRole = Object.values(Role).find((r) => r === role);
    if (validRole) {
      setSelectedRoles((prev) => ({ ...prev, [userId]: validRole }));
    }
  };

  const handleRoleSubmit = async (userId: string) => {
    const newRole = selectedRoles[userId];
    if (!newRole) return;

    try {
      const response = await fetch(`/api/users/${userId}/update-role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_role: newRole }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update role");
      }

      // Refresh the users list
      fetchUsers(currentPage, userSearchQuery);
      // Clear the selected role for this user
      setSelectedRoles((prev) => {
        const updated = { ...prev };
        delete updated[userId];
        return updated;
      });
    } catch (error) {
      console.error("Error updating role:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to update user role. Please try again."
      );
    }
  };

  const handleToggleFeatured = async (articleId: number, featured: boolean) => {
    try {
      const response = await fetch("/api/articles/featured", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ articleId, featured }),
      });

      if (!response.ok) {
        const data = await response.json();
        if (
          response.status === 400 &&
          data.error === "Maximum of 6 featured articles reached"
        ) {
          alert(
            "Maximum of 6 featured articles reached. Please unfeature another article first."
          );
          return;
        }
        throw new Error("Failed to update featured status");
      }

      // Update both states
      setArticles((prevArticles) =>
        prevArticles.map((article) =>
          article.id === articleId ? { ...article, featured } : article
        )
      );
      setApprovedArticles((prevArticles) =>
        prevArticles.map((article) =>
          article.id === articleId ? { ...article, featured } : article
        )
      );
    } catch (error) {
      console.error("Error updating featured status:", error);
      alert("Failed to update featured status. Please try again.");
    }
  };

  const getStatusClass = (status: string | null) => {
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

  const handleFeaturedSearch = (query: string) => {
    setFeaturedSearchQuery(query);
  };

  return (
    <MainLayout isAuthenticated={true}>
      <div className="bg-slate-50 py-8 min-h-screen">
        <div className="ut-container">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Edit Submissions</h1>
            <p className="text-gray-600">
              View and edit assigned paper, article, and poster submissions
            </p>
          </div>

          {/* Submissions Card */}
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Submissions/Entries</CardTitle>
                <CardDescription>
                  Current submissions waiting to be assigned
                </CardDescription>
                <CardDescription className="text-right font-bold text-gray-700">
                  Number of Submissions to Review: {articles.length}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-4">Loading submissions...</div>
                ) : error ? (
                  <div className="text-center text-red-500 py-4">{error}</div>
                ) : articles.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    No submissions waiting for review.
                  </div>
                ) : (
                  <div className="scrollable-table">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Date Uploaded</TableHead>
                          <TableHead>Author</TableHead>
                          <TableHead>Assign to</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {articles.map((article) => (
                          <TableRow key={article.id}>
                            <TableCell className="font-medium">
                              {article.paper_name}
                            </TableCell>
                            <TableCell>{article.type}</TableCell>
                            <TableCell>
                              {new Date(article.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              {article.author.f_name} {article.author.l_name}
                            </TableCell>
                            <TableCell className="relative">
                              {submitted[article.id.toString()] ? (
                                <span className="font-semibold text-green-600">
                                  Assigned
                                </span>
                              ) : (
                                <div className="relative">
                                  <Input
                                    type="text"
                                    placeholder="Search users..."
                                    value={
                                      editorQueries[article.id.toString()] || ""
                                    }
                                    onChange={(e) =>
                                      handleInputChange(
                                        article.id,
                                        e.target.value
                                      )
                                    }
                                    className="w-full"
                                  />
                                  {filteredSuggestions[article.id.toString()]
                                    ?.length > 0 && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                                      {filteredSuggestions[
                                        article.id.toString()
                                      ].map((user) => (
                                        <div
                                          key={user.id}
                                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                          onClick={() => {
                                            setEditorQueries((prev) => ({
                                              ...prev,
                                              [article.id.toString()]: `${user.f_name} ${user.l_name}`,
                                            }));
                                            setFilteredSuggestions((prev) => ({
                                              ...prev,
                                              [article.id.toString()]: [],
                                            }));
                                            // Store the selected user ID instead of submitting immediately
                                            setSelectedReviewers((prev) => ({
                                              ...prev,
                                              [article.id.toString()]: user.id,
                                            }));
                                          }}
                                        >
                                          <div>
                                            <span className="font-medium">
                                              {user.f_name} {user.l_name}
                                            </span>
                                            <span className="text-gray-500 ml-2">
                                              {user.email}
                                            </span>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                  {selectedReviewers[article.id.toString()] && (
                                    <Button
                                      onClick={() =>
                                        handleSubmit(
                                          undefined,
                                          article.id,
                                          selectedReviewers[
                                            article.id.toString()
                                          ]
                                        )
                                      }
                                      className="mt-2 w-full bg-green-600 hover:bg-green-700 text-white"
                                    >
                                      Submit for Review
                                    </Button>
                                  )}
                                </div>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <Link href={`/article/${article.id}`}>
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

          {/* Edit Users Card */}
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Edit Users</CardTitle>
                <CardDescription>
                  Manage user roles and permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Input
                    placeholder="Search users by name or email..."
                    value={userSearchQuery}
                    onChange={(e) => handleUserSearch(e.target.value)}
                    className="max-w-sm"
                  />
                </div>

                {loadingUsers ? (
                  <div className="text-center py-4">Loading users...</div>
                ) : users.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    No users found.
                  </div>
                ) : (
                  <div className="scrollable-table">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Current Role</TableHead>
                          <TableHead>Change Role</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>
                              {user.f_name} {user.l_name}
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.user_role}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Select
                                  value={
                                    selectedRoles[user.id] || user.user_role
                                  }
                                  onValueChange={(value) =>
                                    handleRoleSelect(user.id, value)
                                  }
                                >
                                  <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select a role" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {Object.values(Role).map((role) => (
                                      <SelectItem key={role} value={role}>
                                        {role}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                {selectedRoles[user.id] &&
                                  selectedRoles[user.id] !== user.user_role && (
                                    <Button
                                      onClick={() => handleRoleSubmit(user.id)}
                                      className="bg-red-600 hover:bg-red-700 text-white"
                                    >
                                      Enter Changes
                                    </Button>
                                  )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-4">
                    <Button
                      variant="outline"
                      onClick={() =>
                        fetchUsers(currentPage - 1, userSearchQuery)
                      }
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <span className="py-2">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      onClick={() =>
                        fetchUsers(currentPage + 1, userSearchQuery)
                      }
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Featured Articles Management */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Featured Articles Management</CardTitle>
              <CardDescription>
                Select which articles should be featured on the home page
                (Maximum 6)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Input
                  placeholder="Search articles by title or author..."
                  value={featuredSearchQuery}
                  onChange={(e) => handleFeaturedSearch(e.target.value)}
                  className="max-w-sm"
                />
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Featured</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {approvedArticles
                      .filter(
                        (article) =>
                          article.paper_name
                            .toLowerCase()
                            .includes(featuredSearchQuery.toLowerCase()) ||
                          `${article.author.f_name} ${article.author.l_name}`
                            .toLowerCase()
                            .includes(featuredSearchQuery.toLowerCase())
                      )
                      .map((article) => (
                        <TableRow key={article.id}>
                          <TableCell className="font-medium">
                            {article.paper_name}
                          </TableCell>
                          <TableCell>
                            {article.author.f_name} {article.author.l_name}
                          </TableCell>
                          <TableCell>
                            <span className={getStatusClass(article.status)}>
                              {article.status?.replace("_", " ")}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Switch
                                id={`featured-${article.id}`}
                                checked={article.featured}
                                onCheckedChange={(checked) =>
                                  handleToggleFeatured(article.id, checked)
                                }
                              />
                              <Label htmlFor={`featured-${article.id}`}>
                                {article.featured ? "Featured" : "Not Featured"}
                              </Label>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>

              {approvedArticles.filter((article) => article.featured).length >
                0 && (
                <div className="mt-4 p-4 bg-gray-50 rounded-md">
                  <h3 className="font-semibold mb-2">
                    Currently Featured Articles (
                    {
                      approvedArticles.filter((article) => article.featured)
                        .length
                    }
                    /6)
                  </h3>
                  <div className="space-y-2">
                    {approvedArticles
                      .filter((article) => article.featured)
                      .map((article) => (
                        <div
                          key={article.id}
                          className="flex items-center justify-between p-2 bg-white rounded border"
                        >
                          <div>
                            <span className="font-medium">
                              {article.paper_name}
                            </span>
                            <span className="text-gray-500 ml-2">
                              by {article.author.f_name} {article.author.l_name}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleToggleFeatured(article.id, false)
                            }
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          <DeleteCard></DeleteCard>
        </div>
      </div>
    </MainLayout>
  );
}
