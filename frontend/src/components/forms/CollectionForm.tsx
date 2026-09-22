"use client";

import { type FormEvent, useEffect, useState, useTransition } from "react";
import {
  ApiError,
  createWeeklyCollection,
  listMosques,
  updateWeeklyCollection,
} from "@/lib/api";
import type { CollectionStatus, Mosque, WeeklyCollection } from "@/lib/types";
import { Alert, DetailField, DetailGrid, Field, fieldClass } from "@/components/ui";
import type { FormMode } from "@/components/forms/MosqueForm";

const statuses: CollectionStatus[] = ["draft", "published"];

function dateValue(value?: string | null) {
  return value ? String(value).slice(0, 10) : "";
}

export function CollectionForm({
  mode,
  initial,
  onSuccess,
  onCancel,
}: {
  mode: FormMode;
  initial?: WeeklyCollection | null;
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
      week_start_date: String(form.get("week_start_date") || ""),
      week_end_date: String(form.get("week_end_date") || ""),
      amount: String(form.get("amount") || ""),
      note: String(form.get("note") || "").trim() || undefined,
      status: String(form.get("status") || "draft") as CollectionStatus,
    };

    startTransition(async () => {
      try {
        if (mode === "create") await createWeeklyCollection(payload);
        else if (initial) await updateWeeklyCollection(initial.id, payload);
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
        <DetailField label="Mosque" value={mosqueName} className="sm:col-span-2" />
        <DetailField label="Week start" value={dateValue(initial?.week_start_date)} />
        <DetailField label="Week end" value={dateValue(initial?.week_end_date)} />
        <DetailField label="Amount" value={initial?.amount} />
        <DetailField label="Status" value={initial?.status} />
        <DetailField label="Note" value={initial?.note} className="sm:col-span-2" />
      </DetailGrid>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
      <Field label="Mosque *" className="sm:col-span-2">
        <select name="mosque_id" required defaultValue={initial?.mosque_id || ""} className={fieldClass}>
          <option value="">Select</option>
          {mosques.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
      </Field>
      <Field label="Week start *">
        <input name="week_start_date" type="date" required defaultValue={dateValue(initial?.week_start_date)} className={fieldClass} />
      </Field>
      <Field label="Week end *">
        <input name="week_end_date" type="date" required defaultValue={dateValue(initial?.week_end_date)} className={fieldClass} />
      </Field>
      <Field label="Amount *">
        <input name="amount" type="number" step="0.01" required defaultValue={initial?.amount || ""} className={fieldClass} />
      </Field>
      <Field label="Status">
        <select name="status" defaultValue={initial?.status || "draft"} className={fieldClass}>
          {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </Field>
      <Field label="Note" className="sm:col-span-2">
        <textarea name="note" rows={3} defaultValue={initial?.note || ""} className={fieldClass} />
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
