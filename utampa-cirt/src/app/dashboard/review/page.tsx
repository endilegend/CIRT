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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {Input} from "@/components/ui/input";
import {useRouter} from "next/navigation";


const myPublications = [
    {
        id: 1,
        title: "The Impact of Community Policing on Urban Crime Rates",
        type: "Article",
        date: "Mar 10, 2025",

    },
    {
        id: 2,
        title: "Juvenile Delinquency Prevention Programs: A Comparative Study",
        type: "Paper",
        date: "Feb 15, 2025",

    },
    {
        id: 3,
        title:
            "Technology in Law Enforcement: Current Trends and Future Applications",
        type: "Poster",
        date: "Jan 22, 2025",
    },
];


export default function ReviewPage() {
    const isAuthenticated = true;
    const router = useRouter();

    const [editorQueries, setEditorQueries] = useState<{ [key: number]: string }>({});
    const [submitted, setSubmitted] = useState<{ [key: number]: boolean }>({});
    const [filteredSuggestions, setFilteredSuggestions] = useState<{ [key: number]: string[] }>({});

    const handleInputChange = (id: number, value: string) => {
        setEditorQueries((prev) => ({ ...prev, [id]: value }));

        // Example suggestions - Replace with real data logic
        const allSuggestions = ["endick gay", "ryan sucka", "conor mcn", "Danny boy"];
        const filtered = allSuggestions.filter((name) =>
            name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredSuggestions((prev) => ({ ...prev, [id]: filtered }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>, id: number) => {
        e.preventDefault();
        if (editorQueries[id]?.trim()) {
            console.log(`Searching editors for article ${id}: ${editorQueries[id]}`);
            setSubmitted((prev) => ({ ...prev, [id]: true }));
        }
    };

    return (
        <MainLayout isAuthenticated={isAuthenticated}>
            <div className="bg-slate-50 py-8 min-h-screen">
                <div className="ut-container">
                    {/* Page Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold">Review</h1>
                        <p className="text-gray-600">Review article, paper, and poster submissions</p>
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
                                    Number of Submissions to Review: {myPublications.length}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Title</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Date Uploaded</TableHead>
                                            <TableHead>Assign to</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {myPublications.map((pub) => (
                                            <TableRow key={pub.id}>
                                                <TableCell className="font-medium">{pub.title}</TableCell>
                                                <TableCell>{pub.type}</TableCell>
                                                <TableCell>{pub.date}</TableCell>
                                                <TableCell className="relative">
                                                    <form onSubmit={(e) => handleSubmit(e, pub.id)}>
                                                        {submitted[pub.id] ? (
                                                            <span className="font-semibold text-green-600">Sent</span>
                                                        ) : (
                                                            <>
                                                                <Input
                                                                    placeholder="Search for Editors..."
                                                                    className="px-1"
                                                                    value={editorQueries[pub.id] || ""}
                                                                    onChange={(e) =>
                                                                        handleInputChange(pub.id, e.target.value)
                                                                    }
                                                                    onKeyDown={(e) => {
                                                                        if (e.key === "Enter") {
                                                                            e.preventDefault();
                                                                            handleSubmit(e as any, pub.id);
                                                                        }
                                                                    }}
                                                                />
                                                                {editorQueries[pub.id] &&
                                                                    filteredSuggestions[pub.id]?.length > 0 && (
                                                                        <ul className="absolute bg-white border border-gray-200 w-full mt-1 rounded shadow z-10">
                                                                            {filteredSuggestions[pub.id].map(
                                                                                (suggestion, index) => (
                                                                                    <li
                                                                                        key={index}
                                                                                        className="px-2 py-1 hover:bg-slate-100 cursor-pointer"
                                                                                        onClick={() => {
                                                                                            setEditorQueries((prev) => ({
                                                                                                ...prev,
                                                                                                [pub.id]: suggestion,
                                                                                            }));
                                                                                            setFilteredSuggestions(
                                                                                                (prev) => ({
                                                                                                    ...prev,
                                                                                                    [pub.id]: [],
                                                                                                })
                                                                                            );
                                                                                        }}
                                                                                    >
                                                                                        {suggestion}
                                                                                    </li>
                                                                                )
                                                                            )}
                                                                        </ul>
                                                                    )}
                                                            </>
                                                        )}
                                                    </form>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Link href={`/dashboard/publications/${pub.id}`}>
                                                        <Button className="hover:text-utred" size="sm">
                                                            View
                                                        </Button>
                                                    </Link>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}