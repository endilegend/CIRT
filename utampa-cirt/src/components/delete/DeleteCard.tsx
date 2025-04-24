"use client";
import {useEffect, useState} from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {getAuth} from "firebase/auth";
import {router} from "next/client";

interface DeleteResponse {
  success?: boolean;
  error?: string;
}

export default function DeleteCard() {
  const [emails, setEmails] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [articleIds, setArticleIds] = useState("");
  const [deleteUserArticles, setDeleteUserArticles] = useState(false);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<DeleteResponse | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleDelete = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emails: emails
            .split(",")
            .map((e) => e.trim())
            .filter(Boolean),
          articleIds: articleIds
            .split(",")
            .map((id) => parseInt(id.trim()))
            .filter((id) => !isNaN(id)),
          deleteUserArticles,
        }),
      });

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      setResponse({ error: "Request failed" });
    }

    setLoading(false);
    setShowConfirmDialog(false);
  };

  return (
    // <MainLayout isAuthenticated={true}>
      <div className="ut-container">
      <div className="bg-slate-50 py-8 min-h-screen">
        <div className="ut-container">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Delete Articles or Users</h1>
            <p className="text-gray-600">
              Enter emails or article IDs to delete content. Deleting a user
              will also delete all their articles.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Delete Content</CardTitle>
              <CardDescription>
                Enter comma-separated emails or article IDs to delete
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="emails">Emails</Label>
                <Textarea
                  id="emails"
                  value={emails}
                  onChange={(e) => setEmails(e.target.value)}
                  placeholder="example1@email.com, example2@email.com"
                  className="min-h-[100px]"
                />
                {emails && (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="deleteArticles"
                      checked={deleteUserArticles}
                      onCheckedChange={(checked) =>
                        setDeleteUserArticles(checked === true)
                      }
                    />
                    <Label
                      htmlFor="deleteArticles"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Also delete all articles and reviews by these users
                    </Label>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="articleIds">Article IDs</Label>
                <Textarea
                  id="articleIds"
                  value={articleIds}
                  onChange={(e) => setArticleIds(e.target.value)}
                  placeholder="12, 45, 78"
                  className="min-h-[80px]"
                />
              </div>

              <Button
                onClick={() => setShowConfirmDialog(true)}
                disabled={loading || (!emails && !articleIds)}
                variant="destructive"
                className="w-full"
              >
                {loading ? "Deleting..." : "Delete"}
              </Button>

              {response && (
                <div className="mt-4 p-4 bg-gray-100 rounded-md">
                  <pre className="text-sm overflow-auto">
                    {JSON.stringify(response, null, 2)}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <AlertDialog
          open={showConfirmDialog}
          onOpenChange={setShowConfirmDialog}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                selected
                {emails && " users"}
                {emails && deleteUserArticles && " and all their articles"}
                {emails && articleIds && " and"}
                {articleIds && " articles"}.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      </div>
    // </MainLayout>
  );
}
