"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  listFundRequests,
  listMosques,
  listPaymentAccounts,
  listUsers,
  listWeeklyCollections,
} from "@/lib/api";
import { PageHeader, StatCards } from "@/components/ui";

export default function DashboardHomePage() {
  const [stats, setStats] = useState({
    mosques: 0,
    users: 0,
    payments: 0,
    requests: 0,
    collections: 0,
  });

  useEffect(() => {
    void (async () => {
      const [mosques, users, payments, requests, collections] =
        await Promise.all([
          listMosques(),
          listUsers(),
          listPaymentAccounts(),
          listFundRequests(),
          listWeeklyCollections(),
        ]);
      setStats({
        mosques: mosques.length,
        users: users.length,
        payments: payments.length,
        requests: requests.length,
        collections: collections.length,
      });
    })();
  }, []);

  const cards = [
    { label: "Mosque", value: stats.mosques, href: "/dashboard/mosques" },
    { label: "User", value: stats.users, href: "/dashboard/users" },
    { label: "Payment", value: stats.payments, href: "/dashboard/payments" },
    { label: "Request", value: stats.requests, href: "/dashboard/requests" },
    {
      label: "Collection",
      value: stats.collections,
      href: "/dashboard/collections",
    },
  ];

  return (
    <div>
      <PageHeader
        title="Overview"
        description="Manage mosques, users, payments, fund requests, and weekly collections."
      />
      <StatCards
        items={[
          { label: "Total mosques", value: stats.mosques },
          { label: "Total users", value: stats.users },
          { label: "Total payments", value: stats.payments },
        ]}
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-xl border border-[var(--line)] bg-[var(--bg-mid)] p-5 shadow-[var(--shadow-sm)] transition hover:border-[var(--accent)]/40 hover:shadow-[var(--shadow-md)]"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--ink-muted)]">
              {card.label}
            </p>
            <p className="mt-2 text-3xl font-bold text-[var(--ink)]">
              {card.value}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
