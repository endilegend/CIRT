"use client";

import React, {useState, useRef, useEffect} from "react";
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
import {useRouter, useSearchParams} from "next/navigation";

export default function ArticlesPage() {
    const isAuthenticated = true;

    const [pdfPath, setPdfPath] = useState<string>("");
    const searchParams = useSearchParams();

    useEffect(() => {
        const page = searchParams.get("page");
        if (page){
            const pdfFilePath = `${page}`
            setPdfPath(pdfFilePath)
        }

    }, [searchParams]);

    return (
        <MainLayout isAuthenticated={isAuthenticated}>
            <div className="bg-slate-50 py-8 min-h-screen">
                <div className="ut-container flex justify-center items-center h-[100vh]">
                    <div className="w-3/4 h-full bg-white rounded-lg shadow-lg overflow-hidden">
                        {/* Your PDF Viewer or Content Goes Here */}
                        <iframe
                            src={pdfPath}
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
