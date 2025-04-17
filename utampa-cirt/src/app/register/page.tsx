"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

// Firebase configuration
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function RegisterPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [password, setPassword] = useState("");
  const has8Chars = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const fName = formData.get("first-name") as string;
    const lName = formData.get("last-name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirm-password") as string;

    if (!fName || !lName || !email || !password || !confirmPassword) {
      setErrorMessage("Please fill in all fields!");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      // Register user in Firebase
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await sendEmailVerification(user);
      await signOut(auth);

      setSuccessMessage("Verification email sent! Registration successful.");

      // Send user data to Next.js API for MySQL storage
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          email: user.email,
          fName: fName,
          lName: lName,
        }),
      });

      if (!res.ok) throw new Error("Failed to save user in MySQL");

      console.log("User successfully saved to MySQL");

      setTimeout(() => {
        router.push("/signin");
      }, 2000);
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        setErrorMessage(`Error: ${error.message ?? "Unknown error occurred"}`);
      } else {
        setErrorMessage("An unexpected error occurred.");
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
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    </div>
                    <div class="w-full max-w-sm mx-auto p-1">
                      <ul className="mt-1 text-sm text-black">
                        <li className="flex items-center">
                          <span className={has8Chars ? "text-green-500 mr-2" : "text-red-500 mr-2"}>
                            {has8Chars ? "✓" : "✗"}
                          </span>At least 8 characters
                        </li>
                        <li className="flex items-center">
                          <span className={hasUpper ? "text-green-500 mr-2" : "text-red-500 mr-2"}>
                            {hasUpper ? "✓" : "✗"}
                          </span>One uppercase letter
                        </li>
                        <li className="flex items-center">
                          <span className={hasNumber ? "text-green-500 mr-2" : "text-red-500 mr-2"}>
                            {hasNumber ? "✓" : "✗"}
                          </span>One number
                        </li>
                      </ul>
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

                  {errorMessage && (
                    <div className="text-red-500 text-sm">{errorMessage}</div>
                  )}
                  {successMessage && (
                    <div className="text-green-500 text-sm">
                      {successMessage}
                    </div>
                  )}

                  <Button
                      type="submit"
                      className="w-full bg-utred hover:bg-utred-dark"
                      disabled={loading || !has8Chars || !hasUpper || !hasNumber}
                  >
                    {loading ? "Creating Account..." : "Create Account"}
                  </Button>

                  <p className="text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link href="/signin" className="text-utred hover:underline">
                      Sign In
                    </Link>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
