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

export default function ArticlesPage() {
    const isAuthenticated = true;
    return (
        <MainLayout isAuthenticated={isAuthenticated}>
            <div className="bg-slate-50 py-8 min-h-screen">
                <div className="ut-container flex justify-center items-center h-[100vh]">
                    <div className="w-3/4 h-full bg-white rounded-lg shadow-lg overflow-hidden">
                        {/* Your PDF Viewer or Content Goes Here */}
                        <iframe
                            src="/pdfs/Homework%2BIV.pdf"
                            width="100%"
                            height="100%"
                            type="application/pdf"
                            allowFullScreen
                            className="rounded-lg"
                        />
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
