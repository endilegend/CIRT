"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // For client-side navigation
import { initializeApp, FirebaseError } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
} from "firebase/auth";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";

// Firebase configuration object
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

// Initialize Firebase and Auth
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function RegisterPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle form submission and registration logic
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);

    // Retrieve form values using FormData
    const formData = new FormData(e.currentTarget);
    const fName = formData.get("first-name") as string;
    const lName = formData.get("last-name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirm-password") as string;

    // Validate required fields
    if (!fName || !lName || !email || !password || !confirmPassword) {
      setErrorMessage("Please fill in all fields!");
      setLoading(false);
      return;
    }

    // Validate that passwords match
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      // Create the user in Firebase (automatically signs them in)
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Send verification email
      await sendEmailVerification(user);

      // Sign the user out immediately so they must sign in manually
      await signOut(auth);

      setSuccessMessage("Verification email sent! Registration successful.");

      // Send user data to backend for PostgreSQL storage
      const res = await fetch("http://localhost:4000/register-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          email: user.email,
          fName: fName,
          lName: lName,
          // Backend sets role as "Author" by default
        }),
      });
      const data = await res.json();
      console.log("PostgreSQL Registration Successful:", data);

      // Redirect to sign in page after a short delay
      setTimeout(() => {
        router.push("/signin");
      }, 2000);
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        setErrorMessage(`Error: ${error.message ?? "Unknown error occurred"}`);
      } else {
        setErrorMessage(
          "An unexpected error occurred. Could not redirect to sign-in page"
        );
      }
    }
    setLoading(false);
  };

  return (
    <MainLayout>
      <div className="bg-slate-50 py-12">
        <div className="ut-container max-w-md mx-auto">
          <Card className="shadow-lg">
            <CardHeader className="space-y-1">
              <div className="flex justify-center mb-4">
                <div className="relative h-12 w-12">
                  <Image
                    src="/images/ut-logo.png"
                    alt="University of Tampa Logo"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
              <CardTitle className="text-2xl text-center">
                Create Account
              </CardTitle>
              <CardDescription className="text-center">
                Register to access the CIRT database and contribute your
                research
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">First Name</Label>
                      <Input
                        id="first-name"
                        name="first-name"
                        placeholder="John"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Last Name</Label>
                      <Input
                        id="last-name"
                        name="last-name"
                        placeholder="Doe"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your.email@example.com"
                      required
                    />
                    <p className="text-xs text-gray-500">
                      Use your academic or institutional email if possible
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      required
                    />
                    <p className="text-xs text-gray-500">
                      Password must be at least 8 characters with at least one
                      uppercase letter, one number, and one special character
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      name="confirm-password"
                      type="password"
                      required
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="terms"
                      className="rounded border-gray-300 text-utred focus:ring-utred"
                      required
                    />
                    <label htmlFor="terms" className="text-sm text-gray-600">
                      I agree to the{" "}
                      <Link
                        href="/terms"
                        className="text-utred hover:underline"
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/privacy"
                        className="text-utred hover:underline"
                      >
                        Privacy Policy
                      </Link>
                    </label>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-utred hover:bg-utred-dark"
                    disabled={loading}
                  >
                    {loading ? "Registering..." : "Register"}
                  </Button>
                </div>
              </form>
              {errorMessage && (
                <div
                  id="error-message"
                  className="mt-4 text-center text-sm text-red-600"
                >
                  {errorMessage}
                </div>
              )}
              {successMessage && (
                <div
                  id="success-message"
                  className="mt-4 text-center text-sm text-green-600"
                >
                  {successMessage}
                </div>
              )}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link href="/signin" className="text-utred hover:underline">
                    Sign in
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
