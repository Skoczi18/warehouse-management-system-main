"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SectionCard from "@/app/components/SectionCard";

type SearchSectionProps = {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  handleSearch: () => void;
  loading: boolean;
  searchResults: any | null;
};

export default function SearchSection({
  searchQuery,
  setSearchQuery,
  handleSearch,
  loading,
  searchResults,
}: SearchSectionProps) {
  return (
    <div className="grid gap-4">
      <SectionCard
        title="Globalne wyszukiwanie"
        description="Przeszukuje produkty, zamowienia, dostawy, lokalizacje oraz kontrahentow."
        contentClassName="grid gap-4"
      >
          <div className="grid gap-2">
            <Label>Zapytanie</Label>
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="np. SKU-001, klient, lokalizacja"
            />
            <p className="text-xs text-muted-foreground">Minimum 2 znaki.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={handleSearch} disabled={loading || searchQuery.trim().length < 2}>
              Szukaj
            </Button>
          </div>
          {searchResults && (
            <div className="grid gap-4">
              {(
                [
                  ["Produkty", searchResults.products],
                  ["Zamowienia", searchResults.orders],
                  ["Lokalizacje", searchResults.locations],
                  ["Klienci", searchResults.customers],
                  ["Dostawcy", searchResults.suppliers],
                  ["Dostawy", searchResults.deliveries],
                ] as [string, any[]][]
              ).map(([label, rows]) => (
                <div key={label} className="grid gap-2">
                  <h3 className="text-sm font-semibold">{label}</h3>
                  <div className="grid gap-2">
                    {rows.length === 0 && (
                      <p className="text-sm text-muted-foreground">Brak wynikow.</p>
                    )}
                    {rows.map((row: any) => (
                      <div
                        key={`${row.kind}-${row.id}`}
                        className="rounded-md border bg-white px-3 py-2 text-sm"
                      >
                        {row.label} (ID {row.id})
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
      </SectionCard>
    </div>
  );
}
