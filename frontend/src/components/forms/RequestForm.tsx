"use client";

import { type FormEvent, useEffect, useState, useTransition } from "react";
import { ApiError, createFundRequest, listMosques, updateFundRequest } from "@/lib/api";
import type { FundRequest, FundRequestStatus, Mosque } from "@/lib/types";
import { Alert, DetailField, DetailGrid, Field, fieldClass } from "@/components/ui";
import type { FormMode } from "@/components/forms/MosqueForm";

const statuses: FundRequestStatus[] = [
  "draft",
  "pending",
  "approved",
  "completed",
  "rejected",
  "cancelled",
];

function dateValue(value?: string | null) {
  return value ? String(value).slice(0, 10) : "";
}

export function RequestForm({
  mode,
  initial,
  onSuccess,
  onCancel,
}: {
  mode: FormMode;
  initial?: FundRequest | null;
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
    const payload = {
      mosque_id: String(form.get("mosque_id") || ""),
      title: String(form.get("title") || "").trim(),
      description: String(form.get("description") || "").trim(),
      fund_year: String(form.get("fund_year") || ""),
      required_amount: String(form.get("required_amount") || ""),
      start_date: String(form.get("start_date") || "").trim() || undefined,
      needed_by: String(form.get("needed_by") || "").trim() || undefined,
      contact_person: String(form.get("contact_person") || "").trim() || undefined,
      contact_phone: String(form.get("contact_phone") || "").trim() || undefined,
      status: String(form.get("status") || "draft") as FundRequestStatus,
    };

    startTransition(async () => {
      try {
        if (mode === "create") await createFundRequest(payload);
        else if (initial) await updateFundRequest(initial.id, payload);
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
        <DetailField label="Mosque" value={mosqueName} />
        <DetailField label="Fund year" value={initial?.fund_year} />
        <DetailField label="Title" value={initial?.title} className="sm:col-span-2" />
        <DetailField label="Description" value={initial?.description} className="sm:col-span-2" />
        <DetailField label="Required amount" value={initial?.required_amount} />
        <DetailField label="Status" value={initial?.status} />
        <DetailField label="Start date" value={dateValue(initial?.start_date)} />
        <DetailField label="Needed by" value={dateValue(initial?.needed_by)} />
        <DetailField label="Contact person" value={initial?.contact_person} />
        <DetailField label="Contact phone" value={initial?.contact_phone} />
      </DetailGrid>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
      <Field label="Mosque *">
        <select name="mosque_id" required defaultValue={initial?.mosque_id || ""} className={fieldClass}>
          <option value="">Select</option>
          {mosques.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
      </Field>
      <Field label="Fund year *">
        <input name="fund_year" type="number" required defaultValue={initial?.fund_year || new Date().getFullYear()} className={fieldClass} />
      </Field>
      <Field label="Title *" className="sm:col-span-2">
        <input name="title" required defaultValue={initial?.title || ""} className={fieldClass} />
      </Field>
      <Field label="Description *" className="sm:col-span-2">
        <textarea name="description" required rows={4} defaultValue={initial?.description || ""} className={fieldClass} />
      </Field>
      <Field label="Required amount *">
        <input name="required_amount" type="number" step="0.01" required defaultValue={initial?.required_amount || ""} className={fieldClass} />
      </Field>
      <Field label="Status">
        <select name="status" defaultValue={initial?.status || "draft"} className={fieldClass}>
          {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </Field>
      <Field label="Start date">
        <input name="start_date" type="date" defaultValue={dateValue(initial?.start_date)} className={fieldClass} />
      </Field>
      <Field label="Needed by">
        <input name="needed_by" type="date" defaultValue={dateValue(initial?.needed_by)} className={fieldClass} />
      </Field>
      <Field label="Contact person">
        <input name="contact_person" defaultValue={initial?.contact_person || ""} className={fieldClass} />
      </Field>
      <Field label="Contact phone">
        <input name="contact_phone" defaultValue={initial?.contact_phone || ""} className={fieldClass} />
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
