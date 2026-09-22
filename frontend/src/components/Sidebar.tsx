"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

const links = [
  { href: "/dashboard", label: "Overview", exact: true },
  { href: "/dashboard/mosques", label: "Mosque" },
  { href: "/dashboard/users", label: "User" },
  { href: "/dashboard/payments", label: "Payment" },
  { href: "/dashboard/requests", label: "Request" },
  { href: "/dashboard/collections", label: "Collection" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-[var(--line)] bg-[var(--bg-deep)]/80">
      <div className="border-b border-[var(--line)] px-5 py-6">
        <Link
          href="/dashboard"
          className="font-[family-name:var(--font-display)] text-2xl tracking-tight text-[var(--ink)]"
        >
          Mosque
        </Link>
        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[var(--ink-muted)]">
          Admin panel
        </p>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {links.map((link) => {
          const active = link.exact
            ? pathname === link.href
            : pathname === link.href || pathname.startsWith(`${link.href}/`);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`block rounded-xl px-3 py-2.5 text-sm transition ${
                active
                  ? "bg-[var(--accent)]/15 text-[var(--accent-soft)]"
                  : "text-[var(--ink-muted)] hover:bg-white/5 hover:text-[var(--ink)]"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[var(--line)] px-4 py-4">
        <p className="truncate text-sm text-[var(--ink)]">{user?.name}</p>
        <p className="truncate text-xs text-[var(--ink-muted)]">
          {user?.phone} · {user?.role}
        </p>
        <button
          type="button"
          onClick={logout}
          className="mt-3 w-full rounded-full border border-[var(--line)] px-3 py-2 text-sm text-[var(--ink-muted)] transition hover:border-[var(--danger)]/40 hover:text-[var(--danger)]"
        >
          Log out
        </button>
      </div>
    </aside>
  );
}
