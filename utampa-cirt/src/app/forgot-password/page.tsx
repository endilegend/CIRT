"use client";

import { useState } from "react";
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
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { FirebaseError } from "firebase/app";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      setSuccessMessage(
        "Password reset email sent! Please check your inbox and follow the instructions."
      );
      setEmail("");
    } catch (error) {
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/user-not-found":
            setErrorMessage("No account found with this email address.");
            break;
          case "auth/invalid-email":
            setErrorMessage("Please enter a valid email address.");
            break;
          default:
            setErrorMessage("An error occurred. Please try again.");
        }
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
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
                Reset Password
              </CardTitle>
              <CardDescription className="text-center">
                Enter your email address and we'll send you instructions to
                reset your password.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                {errorMessage && (
                  <div className="text-red-500 text-sm">{errorMessage}</div>
                )}
                {successMessage && (
                  <div className="text-green-500 text-sm">{successMessage}</div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-utred hover:bg-utred-dark"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>

                <div className="text-center text-sm">
                  <Link href="/signin" className="text-utred hover:underline">
                    Back to Sign In
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
