"use client";

import { type FormEvent, useEffect, useState, useTransition } from "react";
import { ApiError, createUser, listMosques, updateUser } from "@/lib/api";
import type { Mosque, User, UserRole } from "@/lib/types";
import { Alert, DetailField, DetailGrid, Field, fieldClass } from "@/components/ui";
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

  if (readOnly) {
    const mosqueName =
      mosques.find((m) => m.id === initial?.mosque_id)?.name ||
      (initial?.mosque_id ? `#${initial.mosque_id}` : null);
    return (
      <DetailGrid>
        <DetailField label="Name" value={initial?.name} className="sm:col-span-2" />
        <DetailField label="Phone" value={initial?.phone} />
        <DetailField label="Email" value={initial?.email} />
        <DetailField label="Role" value={initial?.role} />
        <DetailField label="Mosque" value={mosqueName} />
        <DetailField
          label="Active"
          value={initial?.is_active === false ? "No" : "Yes"}
        />
      </DetailGrid>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
      <Field label="Name *" className="sm:col-span-2">
        <input name="name" required defaultValue={initial?.name || ""} className={fieldClass} />
      </Field>
      <Field label="Phone *">
        <input name="phone" required defaultValue={initial?.phone || ""} className={fieldClass} />
      </Field>
      <Field label={mode === "create" ? "Password *" : "New password"}>
        <input
          name="password"
          type="password"
          required={mode === "create"}
          className={fieldClass}
          placeholder={mode === "edit" ? "Leave blank to keep" : ""}
        />
      </Field>
      <Field label="Email">
        <input name="email" type="email" defaultValue={initial?.email || ""} className={fieldClass} />
      </Field>
      <Field label="Role">
        <select name="role" defaultValue={initial?.role || "mosque_admin"} className={fieldClass}>
          {roles.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
      </Field>
      <Field label="Mosque">
        <select name="mosque_id" defaultValue={initial?.mosque_id ?? ""} className={fieldClass}>
          <option value="">None</option>
          {mosques.map((m) => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
      </Field>
      <Field label="Active">
        <select
          name="is_active"
          defaultValue={initial?.is_active === false ? "false" : "true"}
          className={fieldClass}
        >
          <option value="true">yes</option>
          <option value="false">no</option>
        </select>
      </Field>
      {error ? <div className="sm:col-span-2"><Alert>{error}</Alert></div> : null}
      <div className="sm:col-span-2 flex flex-wrap gap-3 pt-2">
        <button type="submit" disabled={pending} className="rounded-lg bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-sm)] transition hover:bg-[var(--accent-soft)] disabled:opacity-60">
          {pending ? "Saving…" : mode === "create" ? "Create" : "Save changes"}
        </button>
        <button type="button" onClick={onCancel} className="rounded-lg border border-[var(--line)] px-5 py-2.5 text-sm font-medium text-[var(--ink-muted)] transition hover:text-[var(--ink)]">
          Cancel
        </button>
      </div>
    </form>
  );
}
