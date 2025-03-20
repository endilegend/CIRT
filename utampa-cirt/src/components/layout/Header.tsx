"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { initializeApp } from "firebase/app";

// Firebase configuration (ensure these match your project settings)
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

// Initialize Firebase and Auth (if not already initialized elsewhere)
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });
    return unsubscribe;
  }, []);

  return (
    <header className="bg-utred text-white">
      <div className="ut-container flex items-center justify-between h-16">
        <div className="flex items-center space-x-4">
          <Link href="https://www.ut.edu/" className="flex items-center space-x-2">
            <div className="relative h-8 w-8">
              <Image
                src="/images/ut-logo-white.png"
                alt="University of Tampa"
                fill
                className="object-contain"
              />
            </div>
            <span className="font-bold text-xl">CIRT</span>
          </Link>
          <span className="hidden md:inline-block text-sm">
            Criminology Institute for Research and Training
          </span>
        </div>

        <nav className="flex items-center space-x-4">
          <Link href="/" className="hover:text-gray-200 text-sm md:text-base">
            Home
          </Link>
          <Link
            href="/search"
            className="hover:text-gray-200 text-sm md:text-base"
          >
            Search
          </Link>
          <Link
            href="/about"
            className="hover:text-gray-200 text-sm md:text-base"
          >
            About
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center space-x-2">
              <Link href="/dashboard">
                <Button
                  variant="outline"
                  className="text-black hover:bg-utred-dark"
                >
                  Dashboard
                </Button>
              </Link>
              <button onClick={() => signOut(auth)}>
                <span className="text-white hover:text-gray-200 hover:bg-utred-dark">
                  Sign Out
                </span>
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link href="/signin">
                <Button
                  variant="outline"
                  className="text-black hover:bg-utred-dark"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  variant="ghost"
                  className="text-white hover:text-gray-200 hover:bg-utred-dark"
                >
                  Register
                </Button>
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
