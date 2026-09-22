"use client";

import { Sidebar } from "@/components/Sidebar";
import { TopHeader } from "@/components/TopHeader";
import { useRequireAuth } from "@/components/AuthProvider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading, user } = useRequireAuth();

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg-deep)] text-[var(--ink-muted)]">
        Loading…
      </div>
    );
  }

  return (
    <div className="relative z-10 flex min-h-screen bg-[var(--bg-deep)]">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopHeader />
        <div className="min-w-0 flex-1 overflow-auto px-6 py-6 md:px-8">{children}</div>
      </div>
    </div>
  );
}
