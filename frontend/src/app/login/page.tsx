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
    <div className="relative z-10 flex min-h-screen">
      {/* Left — form */}
      <div className="flex w-full flex-col justify-center bg-[linear-gradient(160deg,#f3faf6_0%,#e8f2ec_60%,#f6fbf8_100%)] px-6 py-12 lg:w-[55%] lg:px-12 xl:px-20">
        <div className="mx-auto w-full max-w-md animate-rise">
          <p className="text-center text-sm font-bold tracking-tight text-[var(--ink)] lg:text-left">
            Mosque<span className="text-[var(--accent)]">Admin</span>
          </p>

          <div className="mt-8 rounded-2xl border border-[var(--line)] bg-[var(--bg-mid)] p-7 shadow-[var(--shadow-lg)] sm:p-8">
            <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--accent)]">
              Welcome Back!
            </h1>
            <p className="mt-1.5 text-sm text-[var(--ink-muted)]">
              Sign in to manage your mosques
            </p>

            <form onSubmit={onSubmit} className="mt-7 space-y-4">
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
                className="w-full rounded-lg bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white shadow-[var(--shadow-sm)] transition hover:bg-[var(--accent-soft)] disabled:opacity-60"
              >
                {pending ? "Signing in…" : "Login →"}
              </button>
            </form>

            <p className="mt-6 text-xs text-[var(--ink-muted)]">
              Demo admin:{" "}
              <code className="font-medium text-[var(--accent)]">01000000000</code> /{" "}
              <code className="font-medium text-[var(--accent)]">admin123</code>
            </p>
          </div>
        </div>
      </div>

      {/* Right — image */}
      <div className="relative hidden overflow-hidden bg-[var(--accent)] lg:block lg:w-[45%]">
        <img
          src="/login-illustration.svg"
          alt="Mosque illustration"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[var(--accent-deep)]/55 to-transparent px-10 pb-10 pt-24">
          <p className="text-lg font-semibold text-white">Mosque management</p>
          <p className="mt-1 max-w-sm text-sm text-white/75">
            Oversee mosques, payments, requests, and collections in one place.
          </p>
        </div>
      </div>
    </div>
  );
}
