"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

const titles: Record<string, string> = {
  "/dashboard": "Overview",
  "/dashboard/mosques": "Mosque",
  "/dashboard/users": "User",
  "/dashboard/payments": "Payment",
  "/dashboard/requests": "Request",
  "/dashboard/collections": "Collection",
};

function resolveTitle(pathname: string) {
  if (titles[pathname]) return titles[pathname];
  const match = Object.keys(titles)
    .filter((key) => key !== "/dashboard" && pathname.startsWith(key))
    .sort((a, b) => b.length - a.length)[0];
  return match ? titles[match] : "Dashboard";
}

export function TopHeader() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const title = resolveTitle(pathname);
  const initials = (user?.name || "A")
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-[var(--line)] bg-[var(--bg-mid)] px-6 md:px-8">
      <h2 className="text-sm font-semibold text-[var(--ink)]">{title}</h2>
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--accent-muted)] text-xs font-bold text-[var(--accent)]">
          {initials}
        </div>
        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold leading-tight text-[var(--ink)]">
            {user?.name}
          </p>
          <p className="text-xs capitalize text-[var(--ink-muted)]">{user?.role}</p>
        </div>
        <button
          type="button"
          onClick={logout}
          aria-label="Log out"
          className="ml-1 rounded-lg border border-[var(--line)] p-2 text-[var(--ink-muted)] transition hover:border-[var(--danger)]/30 hover:bg-red-50 hover:text-[var(--danger)]"
        >
          <svg
            viewBox="0 0 20 20"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden
          >
            <path d="M8 4H5a1 1 0 00-1 1v10a1 1 0 001 1h3" strokeLinecap="round" />
            <path d="M12 13l3-3-3-3M15 10H8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </header>
  );
}
