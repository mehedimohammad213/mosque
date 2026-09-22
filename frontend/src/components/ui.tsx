import Link from "next/link";
import type { ReactNode } from "react";

export function PageHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold tracking-tight text-[var(--ink)] md:text-[1.75rem]">
        {title}
      </h1>
      {description ? (
        <p className="mt-1 text-sm text-[var(--ink-muted)]">{description}</p>
      ) : null}
    </div>
  );
}

export function StatCards({
  items,
}: {
  items: { label: string; value: string | number }[];
}) {
  return (
    <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-xl border border-[var(--line)] bg-[var(--bg-mid)] px-5 py-4 shadow-[var(--shadow-sm)]"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--ink-muted)]">
            {item.label}
          </p>
          <p className="mt-2 text-3xl font-bold text-[var(--ink)]">{item.value}</p>
        </div>
      ))}
    </div>
  );
}

export function StatusBadge({
  children,
  tone = "ok",
}: {
  children: ReactNode;
  tone?: "ok" | "muted" | "danger";
}) {
  const styles =
    tone === "ok"
      ? "bg-[var(--accent-muted)] text-[var(--accent-deep)]"
      : tone === "danger"
        ? "bg-red-50 text-[var(--danger)]"
        : "bg-[var(--bg-deep)] text-[var(--ink-muted)]";
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${styles}`}
    >
      {children}
    </span>
  );
}

export function ListToolbar({
  search,
  onSearchChange,
  searchPlaceholder = "Search…",
  actionLabel,
  onAction,
  actionHref,
}: {
  search?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] px-4 py-3.5">
      {onSearchChange ? (
        <div className="relative min-w-[220px] flex-1 max-w-md">
          <svg
            aria-hidden
            viewBox="0 0 20 20"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ink-muted)]"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <circle cx="8.5" cy="8.5" r="5.5" />
            <path d="M13 13l3.5 3.5" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            value={search ?? ""}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full rounded-lg border border-[var(--accent)]/20 bg-[var(--accent-muted)] py-2 pl-9 pr-3 text-sm text-[var(--ink)] outline-none transition placeholder:text-[var(--ink-muted)] focus:border-[var(--accent)] focus:bg-white focus:ring-2 focus:ring-[var(--accent)]/15"
          />
        </div>
      ) : (
        <div />
      )}
      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="rounded-lg bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-sm)] transition hover:bg-[var(--accent-soft)]"
        >
          + {actionLabel}
        </button>
      ) : actionLabel && actionHref ? (
        <Link
          href={actionHref}
          className="rounded-lg bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-sm)] transition hover:bg-[var(--accent-soft)]"
        >
          + {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}

export function ListPanel({
  children,
  footer,
}: {
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--bg-mid)] shadow-[var(--shadow-sm)]">
      {children}
      {footer ? (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--line)] px-4 py-3 text-sm text-[var(--ink-muted)]">
          {footer}
        </div>
      ) : null}
    </div>
  );
}

export function ListFooter({
  from,
  to,
  total,
}: {
  from: number;
  to: number;
  total: number;
}) {
  return (
    <>
      <p>
        Showing {total === 0 ? 0 : from}–{to} of {total}.
      </p>
      <div className="flex items-center gap-2">
        <span className="rounded-lg border border-[var(--line)] px-3 py-1.5 text-sm text-[var(--ink-muted)]">
          Previous
        </span>
        <span className="px-2 text-sm text-[var(--ink)]">Page 1 of 1</span>
        <span className="rounded-lg border border-[var(--line)] px-3 py-1.5 text-sm text-[var(--ink-muted)]">
          Next
        </span>
      </div>
    </>
  );
}

export function Alert({
  tone = "danger",
  children,
}: {
  tone?: "danger" | "ok";
  children: ReactNode;
}) {
  const styles =
    tone === "ok"
      ? "border-[var(--ok)]/25 bg-[var(--accent-muted)] text-[var(--accent-deep)]"
      : "border-[var(--danger)]/25 bg-red-50 text-[var(--danger)]";
  return (
    <div className={`rounded-lg border px-4 py-3 text-sm ${styles}`}>
      {children}
    </div>
  );
}

export function EmptyState({
  title,
  hint,
}: {
  title: string;
  hint?: string;
}) {
  return (
    <div className="px-6 py-12 text-center">
      <p className="text-lg font-semibold text-[var(--ink)]">{title}</p>
      {hint ? <p className="mt-2 text-sm text-[var(--ink-muted)]">{hint}</p> : null}
    </div>
  );
}

export const fieldClass =
  "w-full rounded-lg border border-[var(--accent)]/20 bg-[var(--accent-muted)] px-3.5 py-2.5 text-sm text-[var(--ink)] outline-none transition placeholder:text-[var(--ink-muted)]/70 focus:border-[var(--accent)] focus:bg-white focus:ring-2 focus:ring-[var(--accent)]/20 disabled:bg-[var(--accent-muted)]/60 disabled:text-[var(--ink-muted)]";

export function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={`block space-y-1.5 ${className}`}>
      <span className="text-sm font-medium text-[var(--ink)]">{label}</span>
      {children}
    </label>
  );
}

export function DetailField({
  label,
  value,
  className = "",
}: {
  label: string;
  value?: ReactNode;
  className?: string;
}) {
  const empty =
    value === null ||
    value === undefined ||
    value === "" ||
    (typeof value === "string" && !value.trim());
  return (
    <div
      className={`flex items-start justify-between gap-4 border-b border-[var(--line)] py-3 last:border-b-0 ${className}`}
    >
      <p className="shrink-0 text-sm font-medium text-[var(--ink-muted)]">{label}</p>
      <p className="min-w-0 text-right text-sm font-semibold text-[var(--ink)] break-words">
        {empty ? "—" : value}
      </p>
    </div>
  );
}

export function DetailGrid({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border border-[var(--line)] bg-[var(--accent-muted)]/40 px-4">
      {children}
    </div>
  );
}

export function DataTable({
  headers,
  children,
}: {
  headers: string[];
  children: ReactNode;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-[var(--bg-deep)] text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--ink-muted)]">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-4 py-3 font-semibold">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--line)]">{children}</tbody>
      </table>
    </div>
  );
}

export function RowActions({ children }: { children: ReactNode }) {
  return <div className="flex items-center gap-3">{children}</div>;
}
