"use client";

import { type FormEvent, useState, useTransition } from "react";
import { ApiError, useAuth } from "@/components/AuthProvider";
import { Alert, Field, fieldClass } from "@/components/ui";

export default function LoginPage() {
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const form = new FormData(event.currentTarget);
    const phone = String(form.get("phone") || "").trim();
    const password = String(form.get("password") || "");

    startTransition(async () => {
      try {
        await login(phone, password);
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Login failed");
      }
    });
  }

  return (
    <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-md animate-rise rounded-3xl border border-[var(--line)] bg-[var(--bg-lift)]/50 p-8 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur">
        <p className="text-xs uppercase tracking-[0.28em] text-[var(--accent-soft)]">
          Mosque
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl text-[var(--ink)]">
          Sign in
        </h1>
        <p className="mt-2 text-sm text-[var(--ink-muted)]">
          Use your phone number and password to open the admin panel.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <Field label="Phone">
            <input
              name="phone"
              required
              autoComplete="username"
              defaultValue="01000000000"
              className={fieldClass}
              placeholder="01XXXXXXXXX"
            />
          </Field>
          <Field label="Password">
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              defaultValue="admin123"
              className={fieldClass}
              placeholder="••••••••"
            />
          </Field>

          {error ? <Alert>{error}</Alert> : null}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[var(--bg-deep)] transition hover:bg-[var(--accent-soft)] disabled:opacity-60"
          >
            {pending ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-xs text-[var(--ink-muted)]">
          Demo admin: <code className="text-[var(--accent-soft)]">01000000000</code> /{" "}
          <code className="text-[var(--accent-soft)]">admin123</code>
        </p>
      </div>
    </div>
  );
}
