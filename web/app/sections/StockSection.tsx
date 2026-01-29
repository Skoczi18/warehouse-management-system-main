"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SectionCard from "@/app/components/SectionCard";

type StockSectionProps = {
  lookups: {
    warehouses: any[];
    products: any[];
    locations: any[];
  };
  stockFilters: {
    warehouse_id: string;
    product_id: string;
    location_id: string;
  };
  setStockFilters: React.Dispatch<
    React.SetStateAction<{
      warehouse_id: string;
      product_id: string;
      location_id: string;
    }>
  >;
  stockFilterLookup: {
    product: string;
    location: string;
  };
  setStockFilterLookup: React.Dispatch<
    React.SetStateAction<{
      product: string;
      location: string;
    }>
  >;
  refresh: () => void;
  loading: boolean;
  renderDataTable: () => React.ReactNode;
  stockTransferFilter: {
    product: string;
    location: string;
  };
  setStockTransferFilter: React.Dispatch<
    React.SetStateAction<{
      product: string;
      location: string;
    }>
  >;
  stockTransferForm: {
    product_id: string;
    from_location_id: string;
    to_location_id: string;
    qty: string;
  };
  setStockTransferForm: React.Dispatch<
    React.SetStateAction<{
      product_id: string;
      from_location_id: string;
      to_location_id: string;
      qty: string;
    }>
  >;
  canTransferStock: boolean;
  handleTransferStock: () => void;
  stockTransferMessage: string | null;
};

export default function StockSection({
  lookups,
  stockFilters,
  setStockFilters,
  stockFilterLookup,
  setStockFilterLookup,
  refresh,
  loading,
  renderDataTable,
  stockTransferFilter,
  setStockTransferFilter,
  stockTransferForm,
  setStockTransferForm,
  canTransferStock,
  handleTransferStock,
  stockTransferMessage,
}: StockSectionProps) {
  return (
    <div className="grid gap-3">
      <SectionCard
        title="Podglad stanow"
        description="Tabela ponizej pokazuje produkt, magazyn, lokacje i ilosc."
      >
        <></>
      </SectionCard>
      <div className="grid gap-3 md:grid-cols-3">
        <div className="grid gap-2">
          <Label>Magazyn</Label>
          <select
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            value={stockFilters.warehouse_id}
            onChange={(event) =>
              setStockFilters((prev) => ({
                ...prev,
                warehouse_id: event.target.value,
              }))
            }
          >
            <option value="">Wszystkie magazyny...</option>
            {lookups.warehouses.map((warehouse) => (
              <option key={warehouse.id} value={warehouse.id}>
                {warehouse.name} (ID {warehouse.id})
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-2">
          <Label>Produkt (SKU / nazwa)</Label>
          <Input
            value={stockFilterLookup.product}
            onChange={(event) =>
              setStockFilterLookup((prev) => ({
                ...prev,
                product: event.target.value,
              }))
            }
            placeholder="np. SKU-001"
          />
          <select
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            value={stockFilters.product_id}
            onChange={(event) =>
              setStockFilters((prev) => ({
                ...prev,
                product_id: event.target.value,
              }))
            }
          >
            <option value="">Wszystkie produkty...</option>
            {lookups.products
              .filter((product) =>
                stockFilterLookup.product
                  ? `${product.sku} ${product.name}`
                      .toLowerCase()
                      .includes(stockFilterLookup.product.toLowerCase())
                  : true
              )
              .slice(0, 120)
              .map((product) => (
                <option key={product.id} value={product.id}>
                  {product.sku} - {product.name} (ID {product.id})
                </option>
              ))}
          </select>
        </div>
        <div className="grid gap-2">
          <Label>Lokacja</Label>
          <Input
            value={stockFilterLookup.location}
            onChange={(event) =>
              setStockFilterLookup((prev) => ({
                ...prev,
                location: event.target.value,
              }))
            }
            placeholder="np. A1"
          />
          <select
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            value={stockFilters.location_id}
            onChange={(event) =>
              setStockFilters((prev) => ({
                ...prev,
                location_id: event.target.value,
              }))
            }
          >
            <option value="">Wszystkie lokacje...</option>
            {lookups.locations
              .filter((location) =>
                stockFilterLookup.location
                  ? location.code
                      .toLowerCase()
                      .startsWith(stockFilterLookup.location.toLowerCase())
                  : true
              )
              .slice(0, 120)
              .map((location) => (
                <option key={location.id} value={location.id}>
                  {location.code} (ID {location.id})
                </option>
              ))}
          </select>
        </div>
        <div className="flex items-end">
          <Button onClick={refresh} disabled={loading}>
            Filtruj
          </Button>
        </div>
      </div>
      {renderDataTable()}
      <SectionCard
        title="Szybkie przeniesienie stanu"
        description="Przenies produkt miedzy lokacjami (MAGAZYNIER/KIEROWNIK)."
        contentClassName="grid gap-4 md:grid-cols-2"
      >
          <div className="grid gap-2">
            <Label>Filtr SKU / nazwa</Label>
            <Input
              value={stockTransferFilter.product}
              onChange={(event) =>
                setStockTransferFilter((prev) => ({
                  ...prev,
                  product: event.target.value,
                }))
              }
              placeholder="np. SKU"
            />
            <select
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
              value={stockTransferForm.product_id}
              onChange={(event) =>
                setStockTransferForm((prev) => ({
                  ...prev,
                  product_id: event.target.value,
                }))
              }
            >
              <option value="">Wybierz produkt...</option>
              {lookups.products
                .filter((product) =>
                  stockTransferFilter.product
                    ? `${product.sku} ${product.name}`
                        .toLowerCase()
                        .includes(stockTransferFilter.product.toLowerCase())
                    : true
                )
                .slice(0, 80)
                .map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.sku} - {product.name} (ID {product.id})
                  </option>
                ))}
            </select>
          </div>
          <div className="grid gap-2">
            <Label>Ilosc do przeniesienia</Label>
            <Input
              type="number"
              min="1"
              value={stockTransferForm.qty}
              onChange={(event) =>
                setStockTransferForm((prev) => ({
                  ...prev,
                  qty: event.target.value,
                }))
              }
            />
          </div>
          <div className="grid gap-2">
            <Label>Filtr kodu lokacji</Label>
            <Input
              value={stockTransferFilter.location}
              onChange={(event) =>
                setStockTransferFilter((prev) => ({
                  ...prev,
                  location: event.target.value,
                }))
              }
              placeholder="np. A1"
            />
            <select
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
              value={stockTransferForm.from_location_id}
              onChange={(event) =>
                setStockTransferForm((prev) => ({
                  ...prev,
                  from_location_id: event.target.value,
                }))
              }
            >
              <option value="">Z lokacji...</option>
              {lookups.locations
                .filter((location) =>
                  stockTransferFilter.location
                    ? location.code
                        .toLowerCase()
                        .startsWith(stockTransferFilter.location.toLowerCase())
                    : true
                )
                .slice(0, 80)
                .map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.code} (ID {location.id})
                  </option>
                ))}
            </select>
          </div>
          <div className="grid gap-2">
            <Label>Na lokacje</Label>
            <select
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
              value={stockTransferForm.to_location_id}
              onChange={(event) =>
                setStockTransferForm((prev) => ({
                  ...prev,
                  to_location_id: event.target.value,
                }))
              }
            >
              <option value="">Do lokacji...</option>
              {lookups.locations
                .filter((location) =>
                  stockTransferFilter.location
                    ? location.code
                        .toLowerCase()
                        .startsWith(stockTransferFilter.location.toLowerCase())
                    : true
                )
                .slice(0, 80)
                .map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.code} (ID {location.id})
                  </option>
                ))}
            </select>
          </div>
          <div className="flex flex-wrap items-center gap-3 md:col-span-2">
            <Button
              onClick={handleTransferStock}
              disabled={
                !canTransferStock ||
                loading ||
                !stockTransferForm.product_id ||
                !stockTransferForm.from_location_id ||
                !stockTransferForm.to_location_id
              }
            >
              Przenies
            </Button>
            {!canTransferStock && (
              <p className="text-sm text-muted-foreground">
                Brak uprawnien do przenoszenia stanu.
              </p>
            )}
            {stockTransferMessage && (
              <p className="text-sm text-emerald-600">{stockTransferMessage}</p>
            )}
          </div>
      </SectionCard>
    </div>
  );
}
