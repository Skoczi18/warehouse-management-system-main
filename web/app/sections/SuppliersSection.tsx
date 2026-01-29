"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SectionCard from "@/app/components/SectionCard";
import TableContainer from "@/app/components/TableContainer";

type SuppliersSectionProps = {
  data: any[];
  loading: boolean;
  supplierSearch: string;
  setSupplierSearch: (value: string) => void;
  refresh: () => void;
  canManageSuppliers: boolean;
  setSupplierModalOpen: (open: boolean) => void;
  supplierEditForm: {
    id: string;
    name: string;
    contact_data: string;
  };
  setSupplierEditForm: React.Dispatch<
    React.SetStateAction<{
      id: string;
      name: string;
      contact_data: string;
    }>
  >;
  handleUpdateSupplier: () => void;
  handleDeleteSupplier: () => void;
  handleSelectSupplier: (supplier: any) => void;
  supplierModalOpen: boolean;
  supplierForm: {
    name: string;
    contact_data: string;
  };
  setSupplierForm: React.Dispatch<
    React.SetStateAction<{
      name: string;
      contact_data: string;
    }>
  >;
  handleCreateSupplier: () => void;
  supplierMessage: string | null;
};

export default function SuppliersSection({
  data,
  loading,
  supplierSearch,
  setSupplierSearch,
  refresh,
  canManageSuppliers,
  setSupplierModalOpen,
  supplierEditForm,
  setSupplierEditForm,
  handleUpdateSupplier,
  handleDeleteSupplier,
  handleSelectSupplier,
  supplierModalOpen,
  supplierForm,
  setSupplierForm,
  handleCreateSupplier,
  supplierMessage,
}: SuppliersSectionProps) {
  return (
    <>
      <div className="grid gap-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="grid gap-2">
            <Label>Szukaj dostawcy</Label>
            <Input
              value={supplierSearch}
              onChange={(event) => setSupplierSearch(event.target.value)}
              placeholder="np. Tech Logistics"
            />
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={refresh} disabled={loading}>
              Filtruj
            </Button>
            <Button
              onClick={() => setSupplierModalOpen(true)}
              disabled={!canManageSuppliers}
            >
              Dodaj dostawce
            </Button>
          </div>
        </div>
        <TableContainer>
          <table className="min-w-full text-left text-sm">
            <thead className="sticky top-0 bg-white">
              <tr className="border-b text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3">Nazwa</th>
                <th className="px-4 py-3">Kontakt</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-muted-foreground">
                    Brak dostawcow. Dodaj pierwszego dostawce.
                  </td>
                </tr>
              )}
              {data.map((supplier: any) => (
                <tr
                  key={supplier.id}
                  className="cursor-pointer border-b hover:bg-secondary/40"
                  onClick={() => handleSelectSupplier(supplier)}
                >
                  <td className="px-4 py-3">{supplier.name}</td>
                  <td className="px-4 py-3">{supplier.contact_data ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableContainer>
        {supplierEditForm.id && (
          <SectionCard
            title="Edytuj dostawce"
            description="Kliknij dostawce w tabeli, aby go edytowac."
            contentClassName="grid gap-4 md:grid-cols-2"
          >
              <div className="grid gap-2">
                <Label>ID dostawcy</Label>
                <Input value={supplierEditForm.id} disabled />
              </div>
              <div className="grid gap-2">
                <Label>Nazwa</Label>
                <Input
                  value={supplierEditForm.name}
                  onChange={(event) =>
                    setSupplierEditForm((prev) => ({ ...prev, name: event.target.value }))
                  }
                  disabled={!canManageSuppliers}
                />
              </div>
              <div className="grid gap-2 md:col-span-2">
                <Label>Dane kontaktowe</Label>
                <Input
                  value={supplierEditForm.contact_data}
                  onChange={(event) =>
                    setSupplierEditForm((prev) => ({
                      ...prev,
                      contact_data: event.target.value,
                    }))
                  }
                  disabled={!canManageSuppliers}
                />
              </div>
              <div className="flex flex-wrap items-center gap-3 md:col-span-2">
                <Button
                  onClick={handleUpdateSupplier}
                  disabled={!canManageSuppliers || loading || !supplierEditForm.id}
                >
                  Zapisz zmiany
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteSupplier}
                  disabled={!canManageSuppliers || loading || !supplierEditForm.id}
                >
                  Usun dostawce
                </Button>
              </div>
          </SectionCard>
        )}
      </div>

      {supplierModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xl rounded-2xl border bg-white shadow-xl">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <div>
                <h3 className="text-lg font-semibold">Dodaj dostawce</h3>
                <p className="text-sm text-muted-foreground">
                  Dostawcy sa wymagani przy przyjeciu dostaw.
                </p>
              </div>
              <Button variant="ghost" onClick={() => setSupplierModalOpen(false)}>
                Zamknij
              </Button>
            </div>
            <div className="grid gap-4 p-6 md:grid-cols-2">
              <div className="grid gap-2">
                <Label>Nazwa dostawcy</Label>
                <Input
                  value={supplierForm.name}
                  onChange={(event) =>
                    setSupplierForm((prev) => ({ ...prev, name: event.target.value }))
                  }
                  disabled={!canManageSuppliers}
                />
              </div>
              <div className="grid gap-2">
                <Label>Dane kontaktowe</Label>
                <Input
                  value={supplierForm.contact_data}
                  onChange={(event) =>
                    setSupplierForm((prev) => ({
                      ...prev,
                      contact_data: event.target.value,
                    }))
                  }
                  disabled={!canManageSuppliers}
                />
              </div>
              <div className="flex flex-wrap items-center gap-3 md:col-span-2">
                <Button
                  onClick={handleCreateSupplier}
                  disabled={!canManageSuppliers || loading}
                >
                  Dodaj dostawce
                </Button>
                {supplierMessage && (
                  <p className="text-sm text-emerald-600">{supplierMessage}</p>
                )}
                {!canManageSuppliers && (
                  <p className="text-sm text-muted-foreground">
                    Brak uprawnien do dodawania dostawcow.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
