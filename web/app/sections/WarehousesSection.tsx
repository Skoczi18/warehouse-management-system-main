"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type WarehousesSectionProps = {
  [key: string]: any;
};

export default function WarehousesSection({
  warehouseQuery,
  setWarehouseQuery,
  refresh,
  loading,
  warehouseList,
  warehouseSelected,
  handleSelectWarehouse,
  warehouseTab,
  setWarehouseTab,
  warehouseDashboard,
  warehouseStockQuery,
  setWarehouseStockQuery,
  handleLoadWarehouseDetails,
  warehouseStock,
  lowStockThreshold,
  handleLoadProductLocations,
  warehouseStockTotal,
  warehouseProductLocations,
  warehouseLocations,
  warehouseLocationFilter,
  setWarehouseLocationFilter,
  locationForm,
  setLocationForm,
  locationFormMessage,
  locationEditForm,
  setLocationEditForm,
  handleCreateLocation,
  handleUpdateLocation,
  handleDeleteLocation,
  locationSelectSearch,
  setLocationSelectSearch,
  warehouseView,
  setWarehouseView,
  handleSelectBlockLocation,
  handleBlockLocation,
  canManageLocations,
  warehouseMessage,
  layoutLock,
  handleFetchLock,
  handleAcquireLock,
  handleRefreshLock,
  handleReleaseLock,
  layoutLockMessage,
  canManageWarehouses,
  warehouseForm,
  setWarehouseForm,
  handleCreateWarehouse,
  warehouseFormMessage,
  warehouseEditForm,
  setWarehouseEditForm,
  handleUpdateWarehouse,
}: WarehousesSectionProps) {
  return (
    <div className="grid gap-4">
      <Card className="border-0 bg-secondary/60">
        <CardHeader>
          <CardTitle className="text-base">Wybierz magazyn</CardTitle>
          <CardDescription>
            Szybki wybor magazynu. Szczegoly pojawiaja sie ponizej.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          <div className="grid gap-2 md:grid-cols-[1fr_auto] md:items-end">
            <div className="grid gap-2">
              <Label>Wyszukiwanie</Label>
              <Input
                value={warehouseQuery.q}
                onChange={(event) =>
                  setWarehouseQuery((prev: any) => ({
                    ...prev,
                    q: event.target.value,
                  }))
                }
                placeholder="np. MAIN"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <select
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                value={warehouseQuery.sort}
                onChange={(event) =>
                  setWarehouseQuery((prev: any) => ({
                    ...prev,
                    sort: event.target.value,
                  }))
                }
              >
                <option value="name">Nazwa</option>
                <option value="total_qty">Laczna ilosc</option>
                <option value="last_activity">Ostatnia aktywnosc</option>
              </select>
              <select
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                value={warehouseQuery.order}
                onChange={(event) =>
                  setWarehouseQuery((prev: any) => ({
                    ...prev,
                    order: event.target.value,
                  }))
                }
              >
                <option value="asc">Rosnaco</option>
                <option value="desc">Malejaco</option>
              </select>
              <Button onClick={refresh} disabled={loading}>
                Filtruj
              </Button>
            </div>
          </div>
          <div className="max-h-[220px] overflow-auto rounded-xl border bg-white">
            <table className="min-w-full text-left text-sm">
              <thead className="sticky top-0 bg-white">
                <tr className="border-b text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-3 py-2">Magazyn</th>
                  <th className="px-3 py-2">Lokacje</th>
                  <th className="px-3 py-2">SKU</th>
                  <th className="px-3 py-2">Ilosc</th>
                </tr>
              </thead>
              <tbody>
                {warehouseList.map((warehouse: any) => (
                  <tr
                    key={warehouse.id}
                    className={`cursor-pointer border-b ${
                      warehouseSelected?.id === warehouse.id ? "bg-muted/40" : ""
                    }`}
                    onClick={() => handleSelectWarehouse(warehouse)}
                  >
                    <td className="px-3 py-2 font-medium">{warehouse.name}</td>
                    <td className="px-3 py-2">{warehouse.locations_count}</td>
                    <td className="px-3 py-2">{warehouse.sku_count}</td>
                    <td className="px-3 py-2">{warehouse.total_qty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      <div className="grid gap-4">
        {warehouseSelected ? (
          <>
            <Card className="border-0 bg-secondary/60">
              <CardHeader>
                <CardTitle className="text-base">{warehouseSelected.name}</CardTitle>
                <CardDescription>
                  ID {warehouseSelected.id} · ostatnia aktywnosc:{" "}
                  {warehouseSelected.last_activity_at ?? "-"}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3">
                {[
                  ["summary", "Podsumowanie"],
                  ["stock", "Stany"],
                  ["locations", "Lokalizacje"],
                ].map(([key, label]) => (
                  <Button
                    key={key}
                    variant={warehouseTab === key ? "default" : "outline"}
                    onClick={() => setWarehouseTab(key)}
                  >
                    {label}
                  </Button>
                ))}
              </CardContent>
            </Card>
            {warehouseTab === "summary" && (
              <div className="grid gap-4">
                <Card className="border-0 bg-secondary/60">
                  <CardHeader>
                    <CardTitle className="text-base">KPI</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-3 sm:grid-cols-4">
                    <div className="rounded-md border bg-white p-3 text-sm">
                      Lokacje: {warehouseDashboard?.kpis?.locations_count ?? 0}
                    </div>
                    <div className="rounded-md border bg-white p-3 text-sm">
                      Zablokowane: {warehouseDashboard?.kpis?.blocked_locations_count ?? 0}
                    </div>
                    <div className="rounded-md border bg-white p-3 text-sm">
                      SKU: {warehouseDashboard?.kpis?.sku_count ?? 0}
                    </div>
                    <div className="rounded-md border bg-white p-3 text-sm">
                      Laczna ilosc: {warehouseDashboard?.kpis?.total_qty ?? 0}
                    </div>
                  </CardContent>
                </Card>
                <div className="grid gap-4 lg:grid-cols-3">
                  <Card className="border-0 bg-secondary/60">
                    <CardHeader>
                      <CardTitle className="text-base">Top produkty</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-2">
                      <div className="max-h-[260px] overflow-auto rounded-md border bg-white">
                        <table className="min-w-full text-left text-sm">
                          <thead className="sticky top-0 bg-white">
                            <tr className="border-b text-xs uppercase tracking-wide text-muted-foreground">
                              <th className="px-3 py-2">SKU</th>
                              <th className="px-3 py-2">Produkt</th>
                              <th className="px-3 py-2 text-right">Ilosc</th>
                            </tr>
                          </thead>
                          <tbody>
                            {warehouseDashboard?.top_products?.map((row: any) => (
                              <tr key={row.product_id} className="border-b">
                                <td className="px-3 py-2 text-xs">{row.sku}</td>
                                <td className="px-3 py-2">
                                  <span className="block break-words">{row.name}</span>
                                </td>
                                <td className="px-3 py-2 text-right">{row.qty_total}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-0 bg-secondary/60">
                    <CardHeader>
                      <CardTitle className="text-base">Low stock</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-2">
                      <div className="max-h-[260px] overflow-auto rounded-md border bg-white">
                        <table className="min-w-full text-left text-sm">
                          <thead className="sticky top-0 bg-white">
                            <tr className="border-b text-xs uppercase tracking-wide text-muted-foreground">
                              <th className="px-3 py-2">SKU</th>
                              <th className="px-3 py-2">Produkt</th>
                              <th className="px-3 py-2 text-right">Ilosc</th>
                            </tr>
                          </thead>
                          <tbody>
                            {warehouseDashboard?.low_stock?.map((row: any) => (
                              <tr key={row.product_id} className="border-b text-destructive">
                                <td className="px-3 py-2 text-xs">{row.sku}</td>
                                <td className="px-3 py-2">
                                  <span className="block break-words">{row.name}</span>
                                </td>
                                <td className="px-3 py-2 text-right">{row.qty_total}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-0 bg-secondary/60">
                    <CardHeader>
                      <CardTitle className="text-base">Zablokowane lokacje</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-2">
                      <div className="max-h-[260px] overflow-auto rounded-md border bg-white">
                        <table className="min-w-full text-left text-sm">
                          <thead className="sticky top-0 bg-white">
                            <tr className="border-b text-xs uppercase tracking-wide text-muted-foreground">
                              <th className="px-3 py-2">Lokacja</th>
                              <th className="px-3 py-2 text-right">Pozycje</th>
                            </tr>
                          </thead>
                          <tbody>
                            {warehouseDashboard?.blocked_locations?.map((row: any) => (
                              <tr key={row.location_id} className="border-b">
                                <td className="px-3 py-2">
                                  <span className="block break-words">{row.code}</span>
                                </td>
                                <td className="px-3 py-2 text-right">{row.items_count}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
            {warehouseTab === "stock" && (
              <div className="grid gap-4">
                <Card className="border-0 bg-secondary/60">
                  <CardHeader>
                    <CardTitle className="text-base">Stany magazynowe</CardTitle>
                    <CardDescription>Kliknij produkt, aby zobaczyc lokacje.</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    <div className="flex flex-wrap items-end gap-3">
                      <div className="grid gap-2">
                        <Label>Szukaj produktu</Label>
                        <Input
                          value={warehouseStockQuery.q}
                          onChange={(event) =>
                            setWarehouseStockQuery((prev: any) => ({
                              ...prev,
                              q: event.target.value,
                              page: 1,
                            }))
                          }
                          placeholder="SKU lub nazwa"
                        />
                      </div>
                      <Button
                        onClick={() => handleLoadWarehouseDetails(String(warehouseSelected.id))}
                        disabled={loading}
                      >
                        Filtruj
                      </Button>
                    </div>
                    <div className="max-h-[360px] overflow-auto rounded-xl border bg-white">
                      <table className="min-w-full text-left text-sm">
                        <thead className="sticky top-0 bg-white">
                          <tr className="border-b text-xs uppercase tracking-wide text-muted-foreground">
                            <th className="px-3 py-2">SKU</th>
                            <th className="px-3 py-2">Produkt</th>
                            <th className="px-3 py-2">Ilosc</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[...warehouseStock]
                            .sort((a: any, b: any) => {
                              const aLow = a.qty_total <= lowStockThreshold ? 1 : 0;
                              const bLow = b.qty_total <= lowStockThreshold ? 1 : 0;
                              if (aLow !== bLow) return bLow - aLow;
                              return b.qty_total - a.qty_total;
                            })
                            .map((row: any) => (
                              <tr
                                key={row.product_id}
                                className={`cursor-pointer border-b ${
                                  row.qty_total <= lowStockThreshold ? "bg-destructive/10" : ""
                                }`}
                                onClick={() => handleLoadProductLocations(row.product_id)}
                              >
                                <td className="px-3 py-2">{row.sku}</td>
                                <td className="px-3 py-2">{row.name}</td>
                                <td className="px-3 py-2">{row.qty_total}</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm">
                      <Button
                        variant="outline"
                        disabled={warehouseStockQuery.page <= 1}
                        onClick={() =>
                          setWarehouseStockQuery((prev: any) => ({
                            ...prev,
                            page: Math.max(1, prev.page - 1),
                          }))
                        }
                      >
                        Poprzednia
                      </Button>
                      <Button
                        variant="outline"
                        disabled={
                          warehouseStockQuery.page * warehouseStockQuery.page_size >=
                          warehouseStockTotal
                        }
                        onClick={() =>
                          setWarehouseStockQuery((prev: any) => ({
                            ...prev,
                            page: prev.page + 1,
                          }))
                        }
                      >
                        Nastepna
                      </Button>
                      <span>
                        Strona {warehouseStockQuery.page} · {warehouseStockTotal} wynikow
                      </span>
                    </div>
                  </CardContent>
                </Card>
                {warehouseProductLocations.length > 0 && (
                  <Card className="border-0 bg-secondary/60">
                    <CardHeader>
                      <CardTitle className="text-base">Lokacje produktu</CardTitle>
                      <CardDescription>
                        Szczegoly wybranego produktu w tym magazynie.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                      <div className="max-h-[260px] overflow-auto rounded-xl border bg-white">
                        <table className="min-w-full text-left text-sm">
                          <thead className="sticky top-0 bg-white">
                            <tr className="border-b text-xs uppercase tracking-wide text-muted-foreground">
                              <th className="px-3 py-2">Lokacja</th>
                              <th className="px-3 py-2">Ilosc</th>
                              <th className="px-3 py-2">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {warehouseProductLocations.map((row: any) => (
                              <tr key={row.location_id} className="border-b">
                                <td className="px-3 py-2">{row.code}</td>
                                <td className="px-3 py-2">{row.qty}</td>
                                <td className="px-3 py-2">
                                  {row.is_blocked ? "Zablokowana" : "Aktywna"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
            {warehouseTab === "locations" && (
              <div className="grid gap-4">
                <Card className="border-0 bg-secondary/60">
                  <CardHeader>
                    <CardTitle className="text-base">Lokalizacje</CardTitle>
                    <CardDescription>
                      Lista lokacji w magazynie. Pokazuje status i podglad zawartosci.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    <div className="grid gap-2 md:grid-cols-[1fr_auto] md:items-end">
                      <div className="grid gap-2">
                        <Label>Filtr lokacji</Label>
                        <Input
                          value={warehouseLocationFilter}
                          onChange={(event) => setWarehouseLocationFilter(event.target.value)}
                          placeholder="np. A1"
                        />
                      </div>
                      <Button
                        onClick={() => handleLoadWarehouseDetails(String(warehouseSelected.id))}
                        disabled={loading}
                      >
                        Odswiez
                      </Button>
                    </div>
                    <div className="max-h-[360px] overflow-auto rounded-xl border bg-white">
                      <table className="min-w-full text-left text-sm">
                        <thead className="sticky top-0 bg-white">
                          <tr className="border-b text-xs uppercase tracking-wide text-muted-foreground">
                            <th className="px-3 py-2">Kod</th>
                            <th className="px-3 py-2">Status</th>
                            <th className="px-3 py-2">Pozycje</th>
                            <th className="px-3 py-2">Podglad</th>
                          </tr>
                        </thead>
                        <tbody>
                          {warehouseLocations
                            .filter((location: any) =>
                              warehouseLocationFilter
                                ? String(location.code)
                                    .toLowerCase()
                                    .startsWith(warehouseLocationFilter.toLowerCase())
                                : true
                            )
                            .map((location: any) => (
                              <tr
                                key={location.location_id}
                                className={`border-b ${
                                  location.status === "BLOCKED" ? "bg-destructive/10" : ""
                                }`}
                              >
                                <td className="px-3 py-2">{location.code}</td>
                                <td className="px-3 py-2">{location.status}</td>
                                <td className="px-3 py-2">{location.items_count}</td>
                                <td className="px-3 py-2 text-xs text-muted-foreground">
                                  {(location.items_preview || []).join(", ")}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
                {canManageLocations && (
                  <Card className="border-0 bg-secondary/60">
                    <CardHeader>
                      <CardTitle className="text-base">Dodaj lokacje</CardTitle>
                      <CardDescription>Dodaj nowa polke do magazynu.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                      <div className="grid gap-2">
                        <Label>Magazyn</Label>
                        <select
                          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                          value={locationForm.warehouse_id}
                          onChange={(event) =>
                            setLocationForm((prev: any) => ({
                              ...prev,
                              warehouse_id: event.target.value,
                            }))
                          }
                        >
                          <option value="">Wybierz magazyn...</option>
                          {warehouseList.map((warehouse: any) => (
                            <option key={warehouse.id} value={warehouse.id}>
                              {warehouse.name} (ID {warehouse.id})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="grid gap-2">
                        <Label>Kod lokacji</Label>
                        <Input
                          value={locationForm.code}
                          onChange={(event) =>
                            setLocationForm((prev: any) => ({
                              ...prev,
                              code: event.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Opis</Label>
                        <Input
                          value={locationForm.description}
                          onChange={(event) =>
                            setLocationForm((prev: any) => ({
                              ...prev,
                              description: event.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Typ</Label>
                        <Input
                          value={locationForm.kind}
                          onChange={(event) =>
                            setLocationForm((prev: any) => ({
                              ...prev,
                              kind: event.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          id="location-blocked"
                          type="checkbox"
                          className="h-4 w-4"
                          checked={locationForm.is_blocked}
                          onChange={(event) =>
                            setLocationForm((prev: any) => ({
                              ...prev,
                              is_blocked: event.target.checked,
                            }))
                          }
                        />
                        <Label htmlFor="location-blocked">Zablokowana</Label>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 md:col-span-2">
                        <Button onClick={handleCreateLocation} disabled={loading}>
                          Dodaj lokacje
                        </Button>
                        {locationFormMessage && (
                          <p className="text-sm text-emerald-600">{locationFormMessage}</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
                {canManageLocations && (
                  <Card className="border-0 bg-secondary/60">
                    <CardHeader>
                      <CardTitle className="text-base">Edytuj lokacje</CardTitle>
                      <CardDescription>
                        Aktualizuj kod, opis lub stan blokady.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                      <div className="grid gap-2">
                        <Label>Wybierz lokacje</Label>
                        <select
                          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                          value={locationEditForm.id}
                          onChange={(event) => {
                            const selectedId = event.target.value;
                            const selected = warehouseLocations.find(
                              (location: any) =>
                                String(location.location_id) === String(selectedId)
                            );
                            setLocationEditForm((prev: any) => ({
                              ...prev,
                              id: selectedId,
                              warehouse_id: selected?.warehouse_id
                                ? String(selected.warehouse_id)
                                : prev.warehouse_id,
                              code: selected?.code ?? prev.code,
                              description: selected?.description ?? prev.description,
                              kind: selected?.kind ?? prev.kind,
                              is_blocked: selected?.is_blocked ?? prev.is_blocked,
                            }));
                          }}
                        >
                          <option value="">Wybierz lokacje...</option>
                          {warehouseLocations.map((location: any) => (
                            <option key={location.location_id} value={location.location_id}>
                              {location.code} (ID {location.location_id})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="grid gap-2">
                        <Label>ID lokacji</Label>
                        <Input value={locationEditForm.id} disabled />
                      </div>
                      <div className="grid gap-2">
                        <Label>Magazyn</Label>
                        <select
                          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                          value={locationEditForm.warehouse_id}
                          onChange={(event) =>
                            setLocationEditForm((prev: any) => ({
                              ...prev,
                              warehouse_id: event.target.value,
                            }))
                          }
                        >
                          <option value="">Wybierz magazyn...</option>
                          {warehouseList.map((warehouse: any) => (
                            <option key={warehouse.id} value={warehouse.id}>
                              {warehouse.name} (ID {warehouse.id})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="grid gap-2">
                        <Label>Kod lokacji</Label>
                        <Input
                          value={locationEditForm.code}
                          onChange={(event) =>
                            setLocationEditForm((prev: any) => ({
                              ...prev,
                              code: event.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Opis</Label>
                        <Input
                          value={locationEditForm.description}
                          onChange={(event) =>
                            setLocationEditForm((prev: any) => ({
                              ...prev,
                              description: event.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Typ</Label>
                        <Input
                          value={locationEditForm.kind}
                          onChange={(event) =>
                            setLocationEditForm((prev: any) => ({
                              ...prev,
                              kind: event.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          id="edit-location-blocked"
                          type="checkbox"
                          className="h-4 w-4"
                          checked={locationEditForm.is_blocked}
                          onChange={(event) =>
                            setLocationEditForm((prev: any) => ({
                              ...prev,
                              is_blocked: event.target.checked,
                            }))
                          }
                        />
                        <Label htmlFor="edit-location-blocked">Zablokowana</Label>
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <Button
                          onClick={handleUpdateLocation}
                          disabled={loading || !locationEditForm.id}
                        >
                          Zapisz zmiany
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={handleDeleteLocation}
                          disabled={loading || !locationEditForm.id}
                        >
                          Usun lokacje
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
                <Card className="border-0 bg-secondary/60">
                  <CardHeader>
                    <CardTitle className="text-base">Blokada lokacji i lock layoutu</CardTitle>
                    <CardDescription>
                      Blokada lokacji wstrzymuje prace na konkretnej polce. Lock layoutu
                      chroni caly uklad magazynu przed rownoczesna edycja.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="grid gap-2">
                        <Label>Lokacja do blokady</Label>
                        <Input
                          value={locationSelectSearch}
                          onChange={(event) => setLocationSelectSearch(event.target.value)}
                          placeholder="Filtr po kodzie (np. A1)"
                        />
                        <select
                          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                          value={warehouseView.location_id}
                          onChange={(event) => handleSelectBlockLocation(event.target.value)}
                        >
                          <option value="">Wybierz lokacje...</option>
                          {warehouseLocations
                            .filter((location: any) =>
                              locationSelectSearch
                                ? String(location.code)
                                    .toLowerCase()
                                    .startsWith(locationSelectSearch.toLowerCase())
                                : true
                            )
                            .slice(0, 80)
                            .map((location: any) => (
                              <option key={location.location_id} value={location.location_id}>
                                {location.code} (ID {location.location_id})
                              </option>
                            ))}
                        </select>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          id="block-location"
                          type="checkbox"
                          className="h-4 w-4"
                          checked={warehouseView.is_blocked}
                          onChange={(event) =>
                            setWarehouseView((prev: any) => ({
                              ...prev,
                              is_blocked: event.target.checked,
                            }))
                          }
                          disabled={!canManageLocations}
                        />
                        <Label htmlFor="block-location">Zablokuj lokacje</Label>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 md:col-span-2">
                        <Button
                          onClick={handleBlockLocation}
                          disabled={!canManageLocations || loading || !warehouseView.location_id}
                        >
                          Zapisz blokade
                        </Button>
                        {!canManageLocations && (
                          <p className="text-sm text-muted-foreground">
                            Brak uprawnien do blokowania lokacji.
                          </p>
                        )}
                        {warehouseMessage && (
                          <p className="text-sm text-emerald-600">{warehouseMessage}</p>
                        )}
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="grid gap-2">
                        <Label>Magazyn do locka</Label>
                        <select
                          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                          value={warehouseView.warehouse_id}
                          onChange={(event) =>
                            setWarehouseView((prev: any) => ({
                              ...prev,
                              warehouse_id: event.target.value,
                            }))
                          }
                        >
                          <option value="">Wybierz magazyn...</option>
                          {warehouseList.map((warehouse: any) => (
                            <option key={warehouse.id} value={warehouse.id}>
                              {warehouse.name} (ID {warehouse.id})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="grid gap-2">
                        <Label>Status locka layoutu</Label>
                        <div className="rounded-md border bg-white px-3 py-2 text-sm">
                          {layoutLock
                            ? `LOCK ${layoutLock.lock_id} (uzytkownik ${layoutLock.locked_by})`
                            : "Brak aktywnego locka"}
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label>Wygasa</Label>
                        <div className="rounded-md border bg-white px-3 py-2 text-sm">
                          {layoutLock?.expires_at ?? "-"}
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 md:col-span-2">
                        <Button
                          onClick={handleFetchLock}
                          disabled={loading || !warehouseView.warehouse_id}
                        >
                          Podglad locka
                        </Button>
                        <Button
                          variant="outline"
                          onClick={handleAcquireLock}
                          disabled={!canManageLocations || loading || !warehouseView.warehouse_id}
                        >
                          Zaloz lock
                        </Button>
                        <Button
                          variant="outline"
                          onClick={handleRefreshLock}
                          disabled={!canManageLocations || loading || !layoutLock?.lock_id}
                        >
                          Odswiez lock
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={handleReleaseLock}
                          disabled={!canManageLocations || loading || !layoutLock?.lock_id}
                        >
                          Zwolnij lock
                        </Button>
                        {layoutLockMessage && (
                          <p className="text-sm text-emerald-600">{layoutLockMessage}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            {canManageWarehouses && (
              <Card className="border-0 bg-secondary/60">
                <CardHeader>
                  <CardTitle className="text-base">Dodaj magazyn</CardTitle>
                  <CardDescription>Tylko ADMIN.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label>Nazwa</Label>
                    <Input
                      value={warehouseForm.name}
                      onChange={(event) =>
                        setWarehouseForm((prev: any) => ({
                          ...prev,
                          name: event.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Skala jednostki</Label>
                    <Input
                      value={warehouseForm.unit_scale}
                      onChange={(event) =>
                        setWarehouseForm((prev: any) => ({
                          ...prev,
                          unit_scale: event.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-3 md:col-span-2">
                    <Button onClick={handleCreateWarehouse} disabled={loading}>
                      Dodaj magazyn
                    </Button>
                    {warehouseFormMessage && (
                      <p className="text-sm text-emerald-600">{warehouseFormMessage}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
            {canManageWarehouses && (
              <Card className="border-0 bg-secondary/60">
                <CardHeader>
                  <CardTitle className="text-base">Edytuj magazyn</CardTitle>
                  <CardDescription>Wybierz magazyn z listy.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label>ID magazynu</Label>
                    <Input
                      value={warehouseEditForm.id}
                      onChange={(event) =>
                        setWarehouseEditForm((prev: any) => ({
                          ...prev,
                          id: event.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Wybierz magazyn</Label>
                    <select
                      className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                      value={warehouseEditForm.id}
                      onChange={(event) => {
                        const selectedId = event.target.value;
                        const selected = warehouseList.find(
                          (warehouse: any) => String(warehouse.id) === String(selectedId)
                        );
                        setWarehouseEditForm((prev: any) => ({
                          ...prev,
                          id: selectedId,
                          name: selected?.name ?? prev.name,
                        }));
                      }}
                    >
                      <option value="">Wybierz magazyn...</option>
                      {warehouseList.map((warehouse: any) => (
                        <option key={warehouse.id} value={warehouse.id}>
                          {warehouse.name} (ID {warehouse.id})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Nowa nazwa</Label>
                    <Input
                      value={warehouseEditForm.name}
                      onChange={(event) =>
                        setWarehouseEditForm((prev: any) => ({
                          ...prev,
                          name: event.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="grid gap-2 md:col-span-2">
                    <Label>Nowa skala jednostki</Label>
                    <Input
                      value={warehouseEditForm.unit_scale}
                      onChange={(event) =>
                        setWarehouseEditForm((prev: any) => ({
                          ...prev,
                          unit_scale: event.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-3 md:col-span-2">
                    <Button
                      onClick={handleUpdateWarehouse}
                      disabled={loading || !warehouseEditForm.id}
                    >
                      Zapisz zmiany
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          <Card className="border-0 bg-secondary/60">
            <CardHeader>
              <CardTitle className="text-base">Brak magazynu</CardTitle>
              <CardDescription>Wybierz magazyn z listy.</CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>
    </div>
  );
}
