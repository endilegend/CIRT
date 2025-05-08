"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { Menu, X } from "lucide-react";

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
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });
    return unsubscribe;
  }, []);

  // Close menu on route change (optional, for better UX)
  useEffect(() => {
    if (menuOpen) {
      const handleResize = () => {
        if (window.innerWidth >= 768) setMenuOpen(false);
      };
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [menuOpen]);

  return (
    <header className="bg-utred text-white">
      <div className="ut-container flex items-center justify-between h-16 md:h-16 px-4 relative">
        <div className="flex items-center space-x-2 md:space-x-4">
          <Link href="https://www.ut.edu" className="flex items-center">
            <div className="relative h-8 w-8">
              <Image
                src="/images/ut-logo-white.png"
                alt="University of Tampa"
                fill
                className="object-contain"
              />
            </div>
          </Link>
          <Link
            href="/"
            className="font-bold text-lg md:text-xl hover:text-gray-200"
          >
            CIRT
          </Link>
          <span className="hidden md:inline-block text-sm">
            Criminology Institute for Research and Training
          </span>
        </div>

        {/* Hamburger menu button for mobile */}
        <button
          className="md:hidden ml-2 p-2 rounded focus:outline-none focus:ring-2 focus:ring-white"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center space-x-2 md:space-x-4">
          <Link
            href="/"
            className="hover:text-gray-200 text-sm md:text-base px-2 py-1"
          >
            Home
          </Link>
          <Link
            href="/search"
            className="hover:text-gray-200 text-sm md:text-base px-2 py-1"
          >
            Search
          </Link>
          <Link
            href="/about"
            className="hover:text-gray-200 text-sm md:text-base px-2 py-1"
          >
            About
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center space-x-2">
              <Link href="/dashboard">
                <Button
                  variant="outline"
                  className="text-black hover:bg-utred-dark text-sm md:text-base"
                >
                  Dashboard
                </Button>
              </Link>
              <button onClick={() => signOut(auth)}>
                <span className="text-white hover:text-gray-200 hover:bg-utred-dark text-sm md:text-base">
                  Sign Out
                </span>
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link href="/signin">
                <Button
                  variant="outline"
                  className="text-black hover:bg-utred-dark text-sm md:text-base"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  variant="ghost"
                  className="text-white hover:text-gray-200 hover:bg-utred-dark text-sm md:text-base"
                >
                  Register
                </Button>
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile nav dropdown */}
        {menuOpen && (
          <nav className="absolute top-full left-0 w-full bg-utred shadow-lg z-50 flex flex-col items-start p-4 space-y-2 md:hidden animate-fade-in">
            <Link
              href="/"
              className="w-full hover:text-gray-200 text-base px-2 py-2"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/search"
              className="w-full hover:text-gray-200 text-base px-2 py-2"
              onClick={() => setMenuOpen(false)}
            >
              Search
            </Link>
            <Link
              href="/about"
              className="w-full hover:text-gray-200 text-base px-2 py-2"
              onClick={() => setMenuOpen(false)}
            >
              About
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className="w-full hover:text-gray-200 text-base px-2 py-2"
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  className="w-full text-left hover:text-gray-200 text-base px-2 py-2"
                  onClick={() => {
                    signOut(auth);
                    setMenuOpen(false);
                  }}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/signin"
                  className="w-full hover:text-gray-200 text-base px-2 py-2"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="w-full hover:text-gray-200 text-base px-2 py-2"
                  onClick={() => setMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
