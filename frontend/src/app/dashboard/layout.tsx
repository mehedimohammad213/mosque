"use client";

import { Sidebar } from "@/components/Sidebar";
import { useRequireAuth } from "@/components/AuthProvider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading, user } = useRequireAuth();

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center text-[var(--ink-muted)]">
        Loading…
      </div>
    );
  }

  return (
    <div className="relative z-10 flex min-h-screen">
      <Sidebar />
      <div className="min-w-0 flex-1 overflow-auto px-6 py-8 md:px-10">
        {children}
      </div>
    </div>
  );
}
