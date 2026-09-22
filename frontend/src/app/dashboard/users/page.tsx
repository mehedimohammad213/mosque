"use client";

import { useEffect, useState, useTransition } from "react";
import { ApiError, deleteUser, listUsers } from "@/lib/api";
import type { User } from "@/lib/types";
import { Alert, DataTable, EmptyState, PageHeader } from "@/components/ui";
import { Drawer } from "@/components/Drawer";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import type { FormMode } from "@/components/forms/MosqueForm";
import { UserForm } from "@/components/forms/UserForm";

export default function UsersPage() {
  const [rows, setRows] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [drawer, setDrawer] = useState<{
    open: boolean;
    mode: FormMode;
    item: User | null;
  }>({ open: false, mode: "create", item: null });
  const [removeItem, setRemoveItem] = useState<User | null>(null);

  function load() {
    startTransition(async () => {
      try {
        setRows(await listUsers());
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
        await deleteUser(id);
        setRemoveItem(null);
        load();
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Delete failed");
        setRemoveItem(null);
      }
    });
  }

  const titles = { create: "Create user", edit: "Update user", view: "View user" };

  return (
    <div>
      <PageHeader
        title="User"
        description="Manage admin and mosque admin accounts."
        actionLabel="Add user"
        onAction={() => setDrawer({ open: true, mode: "create", item: null })}
      />
      {error ? <div className="mb-4"><Alert>{error}</Alert></div> : null}
      {rows.length === 0 && !pending ? (
        <EmptyState title="No users" />
      ) : (
        <DataTable headers={["Name", "Phone", "Role", "Active", "Actions"]}>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-[var(--line)] last:border-0">
              <td className="px-4 py-3">{row.name}</td>
              <td className="px-4 py-3 text-[var(--ink-muted)]">{row.phone}</td>
              <td className="px-4 py-3 text-[var(--ink-muted)]">{row.role}</td>
              <td className="px-4 py-3 text-[var(--ink-muted)]">{row.is_active ? "yes" : "no"}</td>
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

      <Drawer open={drawer.open} title={titles[drawer.mode]} description={drawer.item?.name} onClose={closeDrawer}>
        <UserForm
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
        message={`Are you confirm to remove this${removeItem ? ` “${removeItem.name}”` : ""}?`}
        pending={pending}
        onCancel={() => setRemoveItem(null)}
        onConfirm={confirmRemove}
      />
    </div>
  );
}
