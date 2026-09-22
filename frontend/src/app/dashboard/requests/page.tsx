"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { ApiError, deleteFundRequest, listFundRequests } from "@/lib/api";
import type { FundRequest } from "@/lib/types";
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
import type { FormMode } from "@/components/forms/MosqueForm";
import { RequestForm } from "@/components/forms/RequestForm";

export default function RequestsPage() {
  const [rows, setRows] = useState<FundRequest[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [drawer, setDrawer] = useState<{
    open: boolean;
    mode: FormMode;
    item: FundRequest | null;
  }>({ open: false, mode: "create", item: null });
  const [removeItem, setRemoveItem] = useState<FundRequest | null>(null);

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

  function confirmRemove() {
    if (!removeItem) return;
    const id = removeItem.id;
    startTransition(async () => {
      try {
        await deleteFundRequest(id);
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
      [row.title, row.status, String(row.mosque_id), String(row.fund_year)]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [rows, search]);

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
      />
      <StatCards
        items={[
          { label: "Total requests", value: rows.length },
          {
            label: "Approved",
            value: rows.filter((r) => r.status === "approved").length,
          },
          {
            label: "Draft",
            value: rows.filter((r) => r.status === "draft").length,
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
          searchPlaceholder="Search requests..."
          actionLabel="Add request"
          onAction={() => setDrawer({ open: true, mode: "create", item: null })}
        />
        {filtered.length === 0 && !pending ? (
          <EmptyState title="No fund requests" />
        ) : (
          <DataTable
            headers={["Title", "Mosque", "Year", "Amount", "Status", "Actions"]}
          >
            {filtered.map((row) => (
              <tr key={row.id}>
                <td className="px-4 py-3.5 font-medium text-[var(--ink)]">
                  {row.title}
                </td>
                <td className="px-4 py-3.5 text-[var(--ink-muted)]">
                  #{row.mosque_id}
                </td>
                <td className="px-4 py-3.5 text-[var(--ink-muted)]">
                  {row.fund_year}
                </td>
                <td className="px-4 py-3.5 text-[var(--ink-muted)]">
                  {row.required_amount}
                </td>
                <td className="px-4 py-3.5">
                  <StatusBadge
                    tone={
                      row.status === "approved" || row.status === "completed"
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
                      className="text-sm text-[var(--ink-muted)]"
                    >
                      View
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setDrawer({ open: true, mode: "edit", item: row })
                      }
                      className="text-sm text-[var(--accent)]"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setRemoveItem(row)}
                      className="text-sm text-[var(--danger)]"
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
        description={drawer.item?.title}
        onClose={closeDrawer}
        widthClass="max-w-2xl"
      >
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

      <ConfirmDialog
        open={!!removeItem}
        message={`Are you confirm to remove this${removeItem ? ` “${removeItem.title}”` : ""}?`}
        pending={pending}
        onCancel={() => setRemoveItem(null)}
        onConfirm={confirmRemove}
      />
    </div>
  );
}
