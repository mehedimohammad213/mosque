"use client";

import { type FormEvent, useState, useTransition } from "react";
import { ApiError, createMosque, updateMosque } from "@/lib/api";
import type { Mosque, MosqueStatus } from "@/lib/types";
import { Alert, DetailField, DetailGrid, Field, fieldClass } from "@/components/ui";

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

  if (readOnly) {
    return (
      <DetailGrid>
        <DetailField label="Name" value={initial?.name} className="sm:col-span-2" />
        <DetailField label="Name (Bangla)" value={initial?.name_bn} className="sm:col-span-2" />
        <DetailField label="Division" value={initial?.division} />
        <DetailField label="District" value={initial?.district} />
        <DetailField label="Upazila" value={initial?.upazila} />
        <DetailField label="Area" value={initial?.area} />
        <DetailField label="Address" value={initial?.address} className="sm:col-span-2" />
        <DetailField label="Phone" value={initial?.phone} />
        <DetailField label="Email" value={initial?.email} />
        <DetailField label="Status" value={initial?.status} />
      </DetailGrid>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
      <Field label="Name *" className="sm:col-span-2">
        <input name="name" required defaultValue={initial?.name || ""} className={fieldClass} />
      </Field>
      <Field label="Name (Bangla)" className="sm:col-span-2">
        <input name="name_bn" defaultValue={initial?.name_bn || ""} className={fieldClass} />
      </Field>
      <Field label="Division *">
        <input name="division" required defaultValue={initial?.division || ""} className={fieldClass} />
      </Field>
      <Field label="District *">
        <input name="district" required defaultValue={initial?.district || ""} className={fieldClass} />
      </Field>
      <Field label="Upazila">
        <input name="upazila" defaultValue={initial?.upazila || ""} className={fieldClass} />
      </Field>
      <Field label="Area">
        <input name="area" defaultValue={initial?.area || ""} className={fieldClass} />
      </Field>
      <Field label="Address" className="sm:col-span-2">
        <textarea name="address" rows={3} defaultValue={initial?.address || ""} className={fieldClass} />
      </Field>
      <Field label="Phone">
        <input name="phone" defaultValue={initial?.phone || ""} className={fieldClass} />
      </Field>
      <Field label="Email">
        <input name="email" type="email" defaultValue={initial?.email || ""} className={fieldClass} />
      </Field>
      <Field label="Status">
        <select name="status" defaultValue={initial?.status || "pending"} className={fieldClass}>
          {statuses.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </Field>

      {error ? <div className="sm:col-span-2"><Alert>{error}</Alert></div> : null}

      <div className="sm:col-span-2 flex flex-wrap gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-sm)] transition hover:bg-[var(--accent-soft)] disabled:opacity-60"
        >
          {pending ? "Saving…" : mode === "create" ? "Create" : "Save changes"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-[var(--line)] px-5 py-2.5 text-sm font-medium text-[var(--ink-muted)] transition hover:text-[var(--ink)]"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
