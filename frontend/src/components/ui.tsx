import Link from "next/link";
import type { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  actionHref,
  actionLabel,
  onAction,
}: {
  title: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--ink)]">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 text-sm text-[var(--ink-muted)]">{description}</p>
        ) : null}
      </div>
      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--bg-deep)] transition hover:bg-[var(--accent-soft)]"
        >
          {actionLabel}
        </button>
      ) : actionHref && actionLabel ? (
        <Link
          href={actionHref}
          className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--bg-deep)] transition hover:bg-[var(--accent-soft)]"
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
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
      ? "border-[var(--ok)]/30 bg-[var(--ok)]/10 text-[var(--ok)]"
      : "border-[var(--danger)]/30 bg-[var(--danger)]/10 text-[var(--danger)]";
  return (
    <div className={`rounded-xl border px-4 py-3 text-sm ${styles}`}>
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
    <div className="rounded-2xl border border-dashed border-[var(--line)] bg-white/[0.03] px-6 py-12 text-center">
      <p className="font-[family-name:var(--font-display)] text-xl text-[var(--ink)]">
        {title}
      </p>
      {hint ? <p className="mt-2 text-sm text-[var(--ink-muted)]">{hint}</p> : null}
    </div>
  );
}

export const fieldClass =
  "w-full rounded-xl border border-[var(--line)] bg-black/20 px-3.5 py-2.5 text-[var(--ink)] outline-none transition placeholder:text-[var(--ink-muted)]/60 focus:border-[var(--accent)]/50";

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
      <span className="text-xs uppercase tracking-[0.16em] text-[var(--ink-muted)]">
        {label}
      </span>
      {children}
    </label>
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
    <div className="overflow-x-auto rounded-2xl border border-[var(--line)] bg-[var(--bg-lift)]/30">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-[var(--line)] text-xs uppercase tracking-[0.14em] text-[var(--ink-muted)]">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-4 py-3 font-medium">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
