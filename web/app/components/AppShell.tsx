"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";

type AppShellProps<TView extends string> = {
  view: TView;
  setView: React.Dispatch<React.SetStateAction<TView>>;
  allowedViews: Set<TView>;
  loading: boolean;
  onRefresh: () => void;
  children: React.ReactNode;
};

export default function AppShell<TView extends string>({
  view,
  setView,
  allowedViews,
  loading,
  onRefresh,
  children,
}: AppShellProps<TView>) {
  const navItems = [
    ["dashboard", "Dashboard"],
    ["products", "Produkty"],
    ["stock", "Stany"],
    ["deliveries", "Dostawy"],
    ["orders", "Zamowienia"],
    ["customers", "Klienci"],
    ["suppliers", "Dostawcy"],
    ["warehouses", "Magazyny"],
    ["search", "Szukaj"],
    ["admin", "Admin"],
    ["reports", "Raporty"],
  ] as const;

  return (
    <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
      <aside className="flex flex-col gap-3 rounded-2xl border bg-white/90 p-4 shadow-sm">
        {navItems
          .filter(([key]) => allowedViews.has(key as TView))
          .map(([key, label]) => (
            <Button
              key={key}
              variant={view === key ? "default" : "outline"}
              className="justify-start"
              onClick={() => setView(key as TView)}
            >
              {label}
            </Button>
          ))}
        <Button variant="ghost" onClick={onRefresh} disabled={loading}>
          {loading ? "Ladowanie..." : "Odswiez"}
        </Button>
      </aside>

      <section className="flex flex-col gap-4 rounded-2xl border bg-white/95 p-6 shadow-sm">
        {children}
      </section>
    </div>
  );
}
