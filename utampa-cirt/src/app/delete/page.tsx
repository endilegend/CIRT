"use client";
import { useState } from "react";

export default function DeletePage() {
  const [emails, setEmails] = useState("");
  const [articleIds, setArticleIds] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);

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
        }),
      });

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      setResponse({ error: "Request failed" });
    }

    setLoading(false);
  };

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Delete Articles or Users</h1>

      <div>
        <label className="block font-medium">Emails (comma separated)</label>
        <textarea
          value={emails}
          onChange={(e) => setEmails(e.target.value)}
          className="w-full border p-2 rounded"
          rows={3}
          placeholder="example1@email.com, example2@email.com"
        />
      </div>

      <div>
        <label className="block font-medium">
          Article IDs (comma separated)
        </label>
        <textarea
          value={articleIds}
          onChange={(e) => setArticleIds(e.target.value)}
          className="w-full border p-2 rounded"
          rows={2}
          placeholder="12, 45, 78"
        />
      </div>

      <button
        onClick={handleDelete}
        disabled={loading}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        {loading ? "Deleting..." : "Delete"}
      </button>

      {response && (
        <pre className="bg-gray-100 p-4 mt-4 rounded text-sm overflow-auto">
          {JSON.stringify(response, null, 2)}
        </pre>
      )}
    </div>
  );
}
