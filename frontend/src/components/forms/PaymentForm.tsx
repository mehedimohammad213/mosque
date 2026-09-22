"use client";

import { type FormEvent, useEffect, useState, useTransition } from "react";
import {
  ApiError,
  createPaymentAccount,
  listMosques,
  updatePaymentAccount,
} from "@/lib/api";
import type { Mosque, PaymentAccount, PaymentAccountType } from "@/lib/types";
import { Alert, Field, fieldClass } from "@/components/ui";
import type { FormMode } from "@/components/forms/MosqueForm";

const types: PaymentAccountType[] = ["bank", "bkash", "nagad", "rocket", "other"];

export function PaymentForm({
  mode,
  initial,
  onSuccess,
  onCancel,
}: {
  mode: FormMode;
  initial?: PaymentAccount | null;
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
      account_type: String(form.get("account_type") || "bkash") as PaymentAccountType,
      account_number: String(form.get("account_number") || "").trim(),
      account_name: String(form.get("account_name") || "").trim() || undefined,
      bank_name: String(form.get("bank_name") || "").trim() || undefined,
      branch_name: String(form.get("branch_name") || "").trim() || undefined,
      routing_number: String(form.get("routing_number") || "").trim() || undefined,
      is_verified: String(form.get("is_verified") || "false") === "true",
      is_active: String(form.get("is_active") || "true") === "true",
    };

    startTransition(async () => {
      try {
        if (mode === "create") await createPaymentAccount(payload);
        else if (initial) await updatePaymentAccount(initial.id, payload);
        onSuccess();
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Save failed");
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
      <Field label="Mosque *">
        <select name="mosque_id" required disabled={readOnly} defaultValue={initial?.mosque_id || ""} className={fieldClass}>
          <option value="">Select</option>
          {mosques.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
      </Field>
      <Field label="Type *">
        <select name="account_type" disabled={readOnly} defaultValue={initial?.account_type || "bkash"} className={fieldClass}>
          {types.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </Field>
      <Field label="Account number *" className="sm:col-span-2">
        <input name="account_number" required disabled={readOnly} defaultValue={initial?.account_number || ""} className={fieldClass} />
      </Field>
      <Field label="Account name">
        <input name="account_name" disabled={readOnly} defaultValue={initial?.account_name || ""} className={fieldClass} />
      </Field>
      <Field label="Bank name">
        <input name="bank_name" disabled={readOnly} defaultValue={initial?.bank_name || ""} className={fieldClass} />
      </Field>
      <Field label="Branch">
        <input name="branch_name" disabled={readOnly} defaultValue={initial?.branch_name || ""} className={fieldClass} />
      </Field>
      <Field label="Routing number">
        <input name="routing_number" disabled={readOnly} defaultValue={initial?.routing_number || ""} className={fieldClass} />
      </Field>
      <Field label="Verified">
        <select name="is_verified" disabled={readOnly} defaultValue={initial?.is_verified ? "true" : "false"} className={fieldClass}>
          <option value="false">no</option>
          <option value="true">yes</option>
        </select>
      </Field>
      <Field label="Active">
        <select name="is_active" disabled={readOnly} defaultValue={initial?.is_active === false ? "false" : "true"} className={fieldClass}>
          <option value="true">yes</option>
          <option value="false">no</option>
        </select>
      </Field>
      {error ? <div className="sm:col-span-2"><Alert>{error}</Alert></div> : null}
      <div className="sm:col-span-2 flex flex-wrap gap-3 pt-2">
        {!readOnly ? (
          <button type="submit" disabled={pending} className="rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-[var(--bg-deep)] disabled:opacity-60">
            {pending ? "Saving…" : mode === "create" ? "Create" : "Save changes"}
          </button>
        ) : null}
        <button type="button" onClick={onCancel} className="rounded-full border border-[var(--line)] px-5 py-2.5 text-sm text-[var(--ink-muted)]">
          {readOnly ? "Close" : "Cancel"}
        </button>
      </div>
    </form>
  );
}
