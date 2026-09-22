"use client";

import { type FormEvent, useState, useTransition } from "react";
import { ApiError, createMosque, updateMosque } from "@/lib/api";
import type { Mosque, MosqueStatus } from "@/lib/types";
import { Alert, Field, fieldClass } from "@/components/ui";

const statuses: MosqueStatus[] = [
  "pending",
  "verified",
  "rejected",
  "inactive",
];

export type FormMode = "create" | "edit" | "view";

export function MosqueForm({
  mode,
  initial,
  onSuccess,
  onCancel,
}: {
  mode: FormMode;
  initial?: Mosque | null;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const readOnly = mode === "view";
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (readOnly) return;
    setError(null);
    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get("name") || "").trim(),
      division: String(form.get("division") || "").trim(),
      district: String(form.get("district") || "").trim(),
      name_bn: String(form.get("name_bn") || "").trim() || undefined,
      address: String(form.get("address") || "").trim() || undefined,
      upazila: String(form.get("upazila") || "").trim() || undefined,
      area: String(form.get("area") || "").trim() || undefined,
      phone: String(form.get("phone") || "").trim() || undefined,
      email: String(form.get("email") || "").trim() || undefined,
      status: String(form.get("status") || "pending") as MosqueStatus,
    };

    startTransition(async () => {
      try {
        if (mode === "create") {
          await createMosque(payload);
        } else if (initial) {
          await updateMosque(initial.id, payload);
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
      <Field label="Name (Bangla)" className="sm:col-span-2">
        <input name="name_bn" disabled={readOnly} defaultValue={initial?.name_bn || ""} className={fieldClass} />
      </Field>
      <Field label="Division *">
        <input name="division" required disabled={readOnly} defaultValue={initial?.division || ""} className={fieldClass} />
      </Field>
      <Field label="District *">
        <input name="district" required disabled={readOnly} defaultValue={initial?.district || ""} className={fieldClass} />
      </Field>
      <Field label="Upazila">
        <input name="upazila" disabled={readOnly} defaultValue={initial?.upazila || ""} className={fieldClass} />
      </Field>
      <Field label="Area">
        <input name="area" disabled={readOnly} defaultValue={initial?.area || ""} className={fieldClass} />
      </Field>
      <Field label="Address" className="sm:col-span-2">
        <textarea name="address" rows={3} disabled={readOnly} defaultValue={initial?.address || ""} className={fieldClass} />
      </Field>
      <Field label="Phone">
        <input name="phone" disabled={readOnly} defaultValue={initial?.phone || ""} className={fieldClass} />
      </Field>
      <Field label="Email">
        <input name="email" type="email" disabled={readOnly} defaultValue={initial?.email || ""} className={fieldClass} />
      </Field>
      <Field label="Status">
        <select name="status" disabled={readOnly} defaultValue={initial?.status || "pending"} className={fieldClass}>
          {statuses.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </Field>

      {error ? <div className="sm:col-span-2"><Alert>{error}</Alert></div> : null}

      {!readOnly ? (
        <div className="sm:col-span-2 flex flex-wrap gap-3 pt-2">
          <button
            type="submit"
            disabled={pending}
            className="rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-[var(--bg-deep)] disabled:opacity-60"
          >
            {pending ? "Saving…" : mode === "create" ? "Create" : "Save changes"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-[var(--line)] px-5 py-2.5 text-sm text-[var(--ink-muted)] hover:text-[var(--ink)]"
          >
            Cancel
          </button>
        </div>
      ) : null}
    </form>
  );
}
