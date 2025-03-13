"use client";

import { useAuthGuard } from "@/hooks/use-auth-guard";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This will handle redirecting authenticated users away from auth pages
  useAuthGuard();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen flex-col">
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
