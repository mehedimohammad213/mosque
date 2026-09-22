"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { ApiError, deletePaymentAccount, listPaymentAccounts } from "@/lib/api";
import type { PaymentAccount } from "@/lib/types";
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
import { PaymentForm } from "@/components/forms/PaymentForm";

export default function PaymentsPage() {
  const [rows, setRows] = useState<PaymentAccount[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [drawer, setDrawer] = useState<{
    open: boolean;
    mode: FormMode;
    item: PaymentAccount | null;
  }>({ open: false, mode: "create", item: null });
  const [removeItem, setRemoveItem] = useState<PaymentAccount | null>(null);

  function load() {
    startTransition(async () => {
      try {
        setRows(await listPaymentAccounts());
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
        await deletePaymentAccount(id);
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
      [row.account_type, row.account_number, String(row.mosque_id)]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [rows, search]);

  const titles = {
    create: "Create payment",
    edit: "Update payment",
    view: "View payment",
  };

  return (
    <div>
      <PageHeader
        title="Payment"
        description="Mosque payment accounts (bank / mobile wallet)."
      />
      <StatCards
        items={[
          { label: "Total accounts", value: rows.length },
          {
            label: "Active",
            value: rows.filter((r) => r.is_active).length,
          },
          {
            label: "Verified",
            value: rows.filter((r) => r.is_verified).length,
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
          searchPlaceholder="Search payments..."
          actionLabel="Add payment"
          onAction={() => setDrawer({ open: true, mode: "create", item: null })}
        />
        {filtered.length === 0 && !pending ? (
          <EmptyState title="No payment accounts" />
        ) : (
          <DataTable headers={["Mosque", "Type", "Account", "Active", "Actions"]}>
            {filtered.map((row) => (
              <tr key={row.id}>
                <td className="px-4 py-3.5 font-medium text-[var(--ink)]">
                  #{row.mosque_id}
                </td>
                <td className="px-4 py-3.5 text-[var(--ink-muted)]">
                  {row.account_type}
                </td>
                <td className="px-4 py-3.5 text-[var(--ink-muted)]">
                  {row.account_number}
                </td>
                <td className="px-4 py-3.5">
                  <StatusBadge tone={row.is_active ? "ok" : "muted"}>
                    {row.is_active ? "Active" : "Inactive"}
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

      <Drawer open={drawer.open} title={titles[drawer.mode]} onClose={closeDrawer}>
        <PaymentForm
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
