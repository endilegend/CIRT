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




const myPublications = [
    {
        id: 1,
        title: "The Impact of Community Policing on Urban Crime Rates",
        type: "Article",
        date: "Mar 10, 2025",
        status: "Under Review",
    },
    {
        id: 2,
        title: "Juvenile Delinquency Prevention Programs: A Comparative Study",
        type: "Paper",
        date: "Feb 15, 2025",
        status: "Approved",
    },
    {
        id: 3,
        title: "Technology in Law Enforcement: Current Trends and Future Applications",
        type: "Poster",
        date: "Jan 22, 2025",
        status: "Sent",
    },
    {
        id: 4,
        title: "The Fat Man and The Rat: World Hunger and it's Benefits/Consequences",
        type: "Article",
        date: "April 5, 2025",
        status: "Declined",
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

export default function ReviewPage() {
    const isAuthenticated = true;
    return (
        <MainLayout isAuthenticated={isAuthenticated}>
            <div className="bg-slate-50 py-8 min-h-screen">
                <div className="ut-container">
                    {/* Page Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold">My Publications</h1>
                        <p className="text-gray-600">
                            Your submissions/entries
                        </p>
                    </div>
                    <div className="mb-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Publications and Their Status</CardTitle>
                                <CardDescription className="text-right font-bold text-gray-700">
                                    Number of publications: 4
                                </CardDescription >
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Title</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Date Uploaded</TableHead>
                                            <TableHead>Status</TableHead>
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
                                                <TableCell className="text-right">
                                                    <Link href={`/dashboard/publications/${pub.id}`}>
                                                        <Button className="hover:text-utred">
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
