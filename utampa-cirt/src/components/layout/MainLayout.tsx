"use client";

import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

type MainLayoutProps = {
  children: ReactNode;
  isAuthenticated?: boolean;
};

export function MainLayout({ children, isAuthenticated }: MainLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
