import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "@/app/globals.css";
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "UTampa CIRT Database",
  description: "Criminology Institute for Research and Training Database at University of Tampa",
  icons: {
    icon: '/images/ut-logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans`}>
        <Toaster position="top-center" />
        {children}
      </body>
    </html>
  );
}
