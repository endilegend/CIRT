"use client";

import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

// Firebase configuration object (use the same config for your project)
const firebaseConfig = {
  apiKey: "AIzaSyCj7ll6PomPGDKNx981w6HJu3IB97inDKY",
  authDomain: "cirt-9d13f.firebaseapp.com",
  databaseURL: "https://cirt-9d13f-default-rtdb.firebaseio.com",
  projectId: "cirt-9d13f",
  storageBucket: "cirt-9d13f.firebasestorage.app",
  messagingSenderId: "934697913147",
  appId: "1:934697913147:web:b07dce427e2dc31204c51e",
  measurementId: "G-XYDPTRCE75",
};

// Initialize Firebase app and auth
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function HomePage() {
  // Track auth state so we can conditionally show buttons
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });
    return unsubscribe;
  }, []);

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-utblack to-utblack-light text-white py-20">
        <div className="ut-container">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2 space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Welcome to the{" "}
                <span className="text-utred">Criminology Institute</span> for
                Research and Training
              </h1>
              <p className="text-xl text-gray-200">
                Explore our comprehensive database of criminology research,
                publications, and academic resources.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/search">
                  <Button className="bg-utred hover:bg-utred-dark text-white py-2 px-6 rounded-md text-lg">
                    Search Database
                  </Button>
                </Link>
                {isLoggedIn ? (
                  <Link href="/dashboard">
                    <Button
                      variant="outline"
                      className="border-white text-white hover:bg-white/10 py-2 px-6 rounded-md text-lg"
                    >
                      Dashboard
                    </Button>
                  </Link>
                ) : (
                  <Link href="/register">
                    <Button
                      variant="outline"
                      className="border-white text-white hover:bg-white/10 py-2 px-6 rounded-md text-lg"
                    >
                      Register Account
                    </Button>
                  </Link>
                )}
              </div>
            </div>
            <div className="md:w-1/2 relative h-64 md:h-96 w-full">
              <Image
                src="/images/ut-plant-hall.jpg"
                alt="University of Tampa Plant Hall"
                fill
                className="object-cover rounded-lg shadow-lg"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-slate-50">
        <div className="ut-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Database Features</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform provides researchers, students, and faculty with
              powerful tools to explore criminology research.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-t-4 border-t-utred">
              <CardHeader>
                <CardTitle>Academic Publications</CardTitle>
                <CardDescription>
                  Access peer-reviewed articles and journals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Browse through our extensive collection of peer-reviewed
                  articles, journals, and academic papers in the field of
                  criminology.
                </p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-utred">
              <CardHeader>
                <CardTitle>Research Repository</CardTitle>
                <CardDescription>
                  Upload and share your research
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Contribute to the academic community by uploading your
                  research papers, posters, and findings for others to reference
                  and build upon.
                </p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-utred">
              <CardHeader>
                <CardTitle>Advanced Search</CardTitle>
                <CardDescription>Find exactly what you need</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Our powerful search functionality allows you to filter by
                  keywords, authors, publication date, and more to find relevant
                  resources.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Recent Articles */}
      <section className="py-16">
        <div className="ut-container">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Recent Contributions</h2>
            <Link href="/search">
              <Button
                variant="ghost"
                className="text-utred hover:text-utred-dark"
              >
                View All Articles
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentArticles.map((article) => (
              <Card
                key={article.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <CardTitle className="text-lg">{article.title}</CardTitle>
                  <CardDescription>
                    <span className="text-utred">{article.type}</span> •{" "}
                    {article.date}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center">
                    <div className="text-sm">
                      <p className="font-medium">{article.author}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-utred text-white py-16">
        <div className="ut-container text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Contribute?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join our academic community and share your research with scholars
            around the world.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            {isLoggedIn ? (
              <Link href="/dashboard">
                <Button className="bg-white text-utred hover:bg-gray-100 py-2 px-6 rounded-md text-lg">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <Link href="/register">
                <Button className="bg-white text-utred hover:bg-gray-100 py-2 px-6 rounded-md text-lg">
                  Create Account
                </Button>
              </Link>
            )}
            <Link href="/about">
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white/10 py-2 px-6 rounded-md text-lg"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

// Sample data for recent articles
const recentArticles = [
  {
    id: 1,
    title: "The Impact of Community Policing on Urban Crime Rates",
    type: "Article",
    date: "March 10, 2025",
    excerpt:
      "This study examines the effectiveness of community policing strategies in major metropolitan areas over a five-year period.",
    author: "Dr. Sarah Johnson",
  },
  {
    id: 2,
    title: "Digital Forensics in Modern Criminal Investigations",
    type: "Journal",
    date: "February 28, 2025",
    excerpt:
      "An analysis of how digital forensic techniques have evolved and their application in solving complex cases.",
    author: "Prof. Michael Rodriguez",
  },
  {
    id: 3,
    title: "Juvenile Delinquency Prevention Programs: A Comparative Study",
    type: "Paper",
    date: "February 15, 2025",
    excerpt:
      "This paper compares the effectiveness of various prevention programs targeting at-risk youth across different socioeconomic backgrounds.",
    author: "Dr. Emily Chen",
  },
];
