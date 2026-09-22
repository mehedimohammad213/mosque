"use client";

import { useEffect, useState, useTransition } from "react";
import { ApiError, deleteWeeklyCollection, listWeeklyCollections } from "@/lib/api";
import type { WeeklyCollection } from "@/lib/types";
import { Alert, DataTable, EmptyState, PageHeader } from "@/components/ui";
import { Drawer } from "@/components/Drawer";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import type { FormMode } from "@/components/forms/MosqueForm";
import { CollectionForm } from "@/components/forms/CollectionForm";

export default function CollectionsPage() {
  const [rows, setRows] = useState<WeeklyCollection[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [drawer, setDrawer] = useState<{
    open: boolean;
    mode: FormMode;
    item: WeeklyCollection | null;
  }>({ open: false, mode: "create", item: null });
  const [removeItem, setRemoveItem] = useState<WeeklyCollection | null>(null);

  function load() {
    startTransition(async () => {
      try {
        setRows(await listWeeklyCollections());
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

  function confirmRemove() {
    if (!removeItem) return;
    const id = removeItem.id;
    startTransition(async () => {
      try {
        await deleteWeeklyCollection(id);
        setRemoveItem(null);
        load();
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Delete failed");
        setRemoveItem(null);
      }
    });
  }

  const titles = {
    create: "Create collection",
    edit: "Update collection",
    view: "View collection",
  };

  return (
    <div>
      <PageHeader
        title="Collection"
        description="Weekly collection records."
        actionLabel="Add collection"
        onAction={() => setDrawer({ open: true, mode: "create", item: null })}
      />
      {error ? <div className="mb-4"><Alert>{error}</Alert></div> : null}
      {rows.length === 0 && !pending ? (
        <EmptyState title="No collections" />
      ) : (
        <DataTable headers={["Mosque", "Week", "Amount", "Status", "Actions"]}>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-[var(--line)] last:border-0">
              <td className="px-4 py-3">#{row.mosque_id}</td>
              <td className="px-4 py-3 text-[var(--ink-muted)]">
                {String(row.week_start_date).slice(0, 10)} → {String(row.week_end_date).slice(0, 10)}
              </td>
              <td className="px-4 py-3 text-[var(--ink-muted)]">{row.amount}</td>
              <td className="px-4 py-3 text-[var(--ink-muted)]">{row.status}</td>
              <td className="px-4 py-3">
                <div className="flex gap-3">
                  <button type="button" onClick={() => setDrawer({ open: true, mode: "view", item: row })} className="text-[var(--ink-muted)]">View</button>
                  <button type="button" onClick={() => setDrawer({ open: true, mode: "edit", item: row })} className="text-[var(--accent-soft)]">Edit</button>
                  <button type="button" onClick={() => setRemoveItem(row)} className="text-[var(--danger)]">Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </DataTable>
      )}

      <Drawer open={drawer.open} title={titles[drawer.mode]} onClose={closeDrawer}>
        <CollectionForm
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

      <ConfirmDialog
        open={!!removeItem}
        message="Are you confirm to remove this?"
        pending={pending}
        onCancel={() => setRemoveItem(null)}
        onConfirm={confirmRemove}
      />
    </div>
  );
}
