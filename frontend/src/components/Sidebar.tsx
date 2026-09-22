"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-[var(--line)] bg-[var(--bg-mid)]">
      <div className="px-5 py-5">
        <Link
          href="/dashboard"
          className="text-lg font-bold tracking-tight text-[var(--ink)]"
        >
          Mosque<span className="text-[var(--accent)]">Admin</span>
        </Link>
        <p className="mt-0.5 text-xs text-[var(--ink-muted)]">Admin panel</p>
      </div>

      <nav className="flex-1 space-y-0.5 px-3 pb-4">
        {links.map((link) => {
          const active = link.exact
            ? pathname === link.href
            : pathname === link.href || pathname.startsWith(`${link.href}/`);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? "bg-[var(--accent-muted)] text-[var(--accent)]"
                  : "text-[var(--ink-muted)] hover:bg-[var(--bg-deep)] hover:text-[var(--ink)]"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
