"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { ApiError, deleteMosque, listMosques } from "@/lib/api";
import type { Mosque } from "@/lib/types";
import {
  Alert,
  DataTable,
  EmptyState,
  ListFooter,
  ListPanel,
  ListToolbar,
  PageHeader,
  RowActions,
  StatCards,
  StatusBadge,
} from "@/components/ui";
import { Drawer } from "@/components/Drawer";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { MosqueForm, type FormMode } from "@/components/forms/MosqueForm";

export default function MosquesPage() {
  const [rows, setRows] = useState<Mosque[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [drawer, setDrawer] = useState<{
    open: boolean;
    mode: FormMode;
    item: Mosque | null;
  }>({ open: false, mode: "create", item: null });
  const [removeItem, setRemoveItem] = useState<Mosque | null>(null);

  function load() {
    startTransition(async () => {
      try {
        setRows(await listMosques());
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
        await deleteMosque(id);
        setRemoveItem(null);
        load();
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Delete failed");
        setRemoveItem(null);
      }
    });
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((row) =>
      [row.name, row.district, row.division, row.status]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [rows, search]);

  const titles = {
    create: "Create mosque",
    edit: "Update mosque",
    view: "View mosque",
  };

  return (
    <div>
      <PageHeader
        title="Mosque"
        description="List and manage registered mosques."
      />
      <StatCards
        items={[
          { label: "Total mosques", value: rows.length },
          {
            label: "Verified",
            value: rows.filter((r) => r.status === "verified").length,
          },
          {
            label: "Pending",
            value: rows.filter((r) => r.status === "pending").length,
          },
        ]}
      />
      {error ? (
        <div className="mb-4">
          <Alert>{error}</Alert>
        </div>
      ) : null}
      <ListPanel
        footer={
          <ListFooter
            from={filtered.length ? 1 : 0}
            to={filtered.length}
            total={filtered.length}
          />
        }
      >
        <ListToolbar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search mosques..."
          actionLabel="Add mosque"
          onAction={() => setDrawer({ open: true, mode: "create", item: null })}
        />
        {filtered.length === 0 && !pending ? (
          <EmptyState title="No mosques" hint="Create the first mosque." />
        ) : (
          <DataTable headers={["Name", "Location", "Status", "Actions"]}>
            {filtered.map((row) => (
              <tr key={row.id}>
                <td className="px-4 py-3.5 font-medium text-[var(--ink)]">
                  {row.name}
                </td>
                <td className="px-4 py-3.5 text-[var(--ink-muted)]">
                  {row.district}, {row.division}
                </td>
                <td className="px-4 py-3.5">
                  <StatusBadge
                    tone={
                      row.status === "verified"
                        ? "ok"
                        : row.status === "rejected"
                          ? "danger"
                          : "muted"
                    }
                  >
                    {row.status}
                  </StatusBadge>
                </td>
                <td className="px-4 py-3.5">
                  <RowActions>
                    <button
                      type="button"
                      onClick={() =>
                        setDrawer({ open: true, mode: "view", item: row })
                      }
                      className="text-sm text-[var(--ink-muted)] hover:text-[var(--ink)]"
                    >
                      View
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setDrawer({ open: true, mode: "edit", item: row })
                      }
                      className="text-sm text-[var(--accent)] hover:text-[var(--accent-soft)]"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setRemoveItem(row)}
                      className="text-sm text-[var(--danger)] hover:opacity-80"
                    >
                      Delete
                    </button>
                  </RowActions>
                </td>
              </tr>
            ))}
          </DataTable>
        )}
      </ListPanel>

      <Drawer
        open={drawer.open}
        title={titles[drawer.mode]}
        description={drawer.item?.name}
        onClose={closeDrawer}
      >
        <MosqueForm
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
