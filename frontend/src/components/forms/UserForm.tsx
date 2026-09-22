"use client";

import { type FormEvent, useEffect, useState, useTransition } from "react";
import { ApiError, createUser, listMosques, updateUser } from "@/lib/api";
import type { Mosque, User, UserRole } from "@/lib/types";
import { Alert, Field, fieldClass } from "@/components/ui";
import type { FormMode } from "@/components/forms/MosqueForm";

const roles: UserRole[] = ["admin", "mosque_admin"];

export function UserForm({
  mode,
  initial,
  onSuccess,
  onCancel,
}: {
  mode: FormMode;
  initial?: User | null;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const readOnly = mode === "view";
  const [mosques, setMosques] = useState<Mosque[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    void listMosques().then(setMosques).catch(() => setMosques([]));
  }, []);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (readOnly) return;
    setError(null);
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") || "");
    const mosqueId = String(form.get("mosque_id") || "");
    const payload = {
      name: String(form.get("name") || "").trim(),
      phone: String(form.get("phone") || "").trim(),
      email: String(form.get("email") || "").trim() || undefined,
      role: String(form.get("role") || "mosque_admin") as UserRole,
      mosque_id: mosqueId || null,
      is_active: String(form.get("is_active") || "true") === "true",
    };

    startTransition(async () => {
      try {
        if (mode === "create") {
          if (!password) {
            setError("Password is required");
            return;
          }
          await createUser({ ...payload, password });
        } else if (initial) {
          await updateUser(initial.id, {
            ...payload,
            ...(password ? { password } : {}),
          });
        }
        onSuccess();
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Save failed");
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
      <Field label="Name *" className="sm:col-span-2">
        <input name="name" required disabled={readOnly} defaultValue={initial?.name || ""} className={fieldClass} />
      </Field>
      <Field label="Phone *">
        <input name="phone" required disabled={readOnly} defaultValue={initial?.phone || ""} className={fieldClass} />
      </Field>
      <Field label={mode === "create" ? "Password *" : "New password"}>
        <input
          name="password"
          type="password"
          required={mode === "create"}
          disabled={readOnly}
          className={fieldClass}
          placeholder={mode === "edit" ? "Leave blank to keep" : ""}
        />
      </Field>
      <Field label="Email">
        <input name="email" type="email" disabled={readOnly} defaultValue={initial?.email || ""} className={fieldClass} />
      </Field>
      <Field label="Role">
        <select name="role" disabled={readOnly} defaultValue={initial?.role || "mosque_admin"} className={fieldClass}>
          {roles.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
      </Field>
      <Field label="Mosque">
        <select name="mosque_id" disabled={readOnly} defaultValue={initial?.mosque_id ?? ""} className={fieldClass}>
          <option value="">None</option>
          {mosques.map((m) => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
      </Field>
      <Field label="Active">
        <select
          name="is_active"
          disabled={readOnly}
          defaultValue={initial?.is_active === false ? "false" : "true"}
          className={fieldClass}
        >
          <option value="true">yes</option>
          <option value="false">no</option>
        </select>
      </Field>
      {error ? <div className="sm:col-span-2"><Alert>{error}</Alert></div> : null}
      {!readOnly ? (
        <div className="sm:col-span-2 flex flex-wrap gap-3 pt-2">
          <button type="submit" disabled={pending} className="rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-[var(--bg-deep)] disabled:opacity-60">
            {pending ? "Saving…" : mode === "create" ? "Create" : "Save changes"}
          </button>
          <button type="button" onClick={onCancel} className="rounded-full border border-[var(--line)] px-5 py-2.5 text-sm text-[var(--ink-muted)]">
            Cancel
          </button>
        </div>
      ) : null}
    </form>
  );
}
