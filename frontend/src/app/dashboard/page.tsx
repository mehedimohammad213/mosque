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
import { PageHeader } from "@/components/ui";

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
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-2xl border border-[var(--line)] bg-[var(--bg-lift)]/40 p-5 transition hover:border-[var(--accent)]/40"
          >
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--ink-muted)]">
              {card.label}
            </p>
            <p className="mt-3 font-[family-name:var(--font-display)] text-4xl text-[var(--ink)]">
              {card.value}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
