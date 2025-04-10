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
    status: "Waiting for review",
  },
  {
    id: 2,
    title: "Juvenile Delinquency Prevention Programs: A Comparative Study",
    type: "Paper",
    date: "Feb 15, 2025",
    status: "Waiting for review",
  },
  {
    id: 3,
    title:
      "Technology in Law Enforcement: Current Trends and Future Applications",
    type: "Poster",
    date: "Jan 22, 2025",
    status: "Waiting for review",
  },
  {
    id: 4,
    title:
      "The Fat Man and The Rat: World Hunger and it's Benefits/Consequences",
    type: "Article",
    date: "April 5, 2025",
    status: "Waiting for review",
  },
];

function getStatusClass(status: string) {
  switch (status) {
    case "Waiting for review":
      return "px-2 py-1 bg-green-100 text-grey-800 text-xs rounded-full";
    default:
      return "px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full";
  }
}

export default function EditorPage() {
  const isAuthenticated = true;
  return (
    <MainLayout isAuthenticated={isAuthenticated}>
      <div className="bg-slate-50 py-8 min-h-screen">
        <div className="ut-container">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold">View and Edit</h1>
            <p className="text-gray-600">
              Edit paper, article, and poster submissions
            </p>
          </div>
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Submissions Assigned to You</CardTitle>
                <CardDescription className="text-right font-bold text-gray-700">
                  Number of Submissions Assigned: 4
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
