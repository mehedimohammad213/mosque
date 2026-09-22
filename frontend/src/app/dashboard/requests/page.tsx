"use client";

import { useEffect, useState, useTransition } from "react";
import { ApiError, deleteFundRequest, listFundRequests } from "@/lib/api";
import type { FundRequest } from "@/lib/types";
import { Alert, DataTable, EmptyState, PageHeader } from "@/components/ui";
import { Drawer } from "@/components/Drawer";
import type { FormMode } from "@/components/forms/MosqueForm";
import { RequestForm } from "@/components/forms/RequestForm";

export default function RequestsPage() {
  const [rows, setRows] = useState<FundRequest[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [drawer, setDrawer] = useState<{
    open: boolean;
    mode: FormMode;
    item: FundRequest | null;
  }>({ open: false, mode: "create", item: null });

  function load() {
    startTransition(async () => {
      try {
        setRows(await listFundRequests());
        setError(null);
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Failed to load");
      }
    });
  }

  useEffect(() => {
    load();
  }, []);

  function closeDrawer() {
    setDrawer({ open: false, mode: "create", item: null });
  }

  function onDelete(id: number, title: string) {
    if (!confirm(`Delete request “${title}”?`)) return;
    startTransition(async () => {
      try {
        await deleteFundRequest(id);
        load();
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Delete failed");
      }
    });
  }

  const titles = {
    create: "Create request",
    edit: "Update request",
    view: "View request",
  };

  return (
    <div>
      <PageHeader
        title="Request"
        description="Fund requests raised by mosques."
        actionLabel="Add request"
        onAction={() => setDrawer({ open: true, mode: "create", item: null })}
      />
      {error ? <div className="mb-4"><Alert>{error}</Alert></div> : null}
      {rows.length === 0 && !pending ? (
        <EmptyState title="No fund requests" />
      ) : (
        <DataTable headers={["Title", "Mosque", "Year", "Amount", "Status", "Actions"]}>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-[var(--line)] last:border-0">
              <td className="px-4 py-3">{row.title}</td>
              <td className="px-4 py-3 text-[var(--ink-muted)]">#{row.mosque_id}</td>
              <td className="px-4 py-3 text-[var(--ink-muted)]">{row.fund_year}</td>
              <td className="px-4 py-3 text-[var(--ink-muted)]">{row.required_amount}</td>
              <td className="px-4 py-3 text-[var(--ink-muted)]">{row.status}</td>
              <td className="px-4 py-3">
                <div className="flex gap-3">
                  <button type="button" onClick={() => setDrawer({ open: true, mode: "view", item: row })} className="text-[var(--ink-muted)]">View</button>
                  <button type="button" onClick={() => setDrawer({ open: true, mode: "edit", item: row })} className="text-[var(--accent-soft)]">Edit</button>
                  <button type="button" onClick={() => onDelete(row.id, row.title)} className="text-[var(--danger)]">Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </DataTable>
      )}

      <Drawer open={drawer.open} title={titles[drawer.mode]} description={drawer.item?.title} onClose={closeDrawer} widthClass="max-w-2xl">
        <RequestForm
          key={`${drawer.mode}-${drawer.item?.id || "new"}`}
          mode={drawer.mode}
          initial={drawer.item}
          onCancel={closeDrawer}
          onSuccess={() => {
            closeDrawer();
            load();
          }}
        />
      </Drawer>
    </div>
  );
}
