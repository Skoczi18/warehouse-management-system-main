"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SectionCard from "@/app/components/SectionCard";
import TableContainer from "@/app/components/TableContainer";

type CustomersSectionProps = {
  data: any[];
  loading: boolean;
  customerSearch: string;
  setCustomerSearch: (value: string) => void;
  refresh: () => void;
  canManageCustomers: boolean;
  setCustomerModalOpen: (open: boolean) => void;
  customerEditForm: {
    id: string;
    name: string;
    contact_data: string;
  };
  setCustomerEditForm: React.Dispatch<
    React.SetStateAction<{
      id: string;
      name: string;
      contact_data: string;
    }>
  >;
  handleUpdateCustomer: () => void;
  handleDeleteCustomer: () => void;
  handleSelectCustomer: (customer: any) => void;
  customerModalOpen: boolean;
  customerForm: {
    name: string;
    contact_data: string;
  };
  setCustomerForm: React.Dispatch<
    React.SetStateAction<{
      name: string;
      contact_data: string;
    }>
  >;
  handleCreateCustomer: () => void;
  customerMessage: string | null;
};

export default function CustomersSection({
  data,
  loading,
  customerSearch,
  setCustomerSearch,
  refresh,
  canManageCustomers,
  setCustomerModalOpen,
  customerEditForm,
  setCustomerEditForm,
  handleUpdateCustomer,
  handleDeleteCustomer,
  handleSelectCustomer,
  customerModalOpen,
  customerForm,
  setCustomerForm,
  handleCreateCustomer,
  customerMessage,
}: CustomersSectionProps) {
  return (
    <>
      <div className="grid gap-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="grid gap-2">
            <Label>Szukaj klienta</Label>
            <Input
              value={customerSearch}
              onChange={(event) => setCustomerSearch(event.target.value)}
              placeholder="np. ABC Sp. z o.o."
            />
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={refresh} disabled={loading}>
              Filtruj
            </Button>
            <Button
              onClick={() => setCustomerModalOpen(true)}
              disabled={!canManageCustomers}
            >
              Dodaj klienta
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
                    Brak klientow. Dodaj pierwszego klienta.
                  </td>
                </tr>
              )}
              {data.map((customer: any) => (
                <tr
                  key={customer.id}
                  className="cursor-pointer border-b hover:bg-secondary/40"
                  onClick={() => handleSelectCustomer(customer)}
                >
                  <td className="px-4 py-3">{customer.name}</td>
                  <td className="px-4 py-3">{customer.contact_data ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableContainer>
        {customerEditForm.id && (
          <SectionCard
            title="Edytuj klienta"
            description="Kliknij klienta w tabeli, aby go edytowac."
            contentClassName="grid gap-4 md:grid-cols-2"
          >
              <div className="grid gap-2">
                <Label>ID klienta</Label>
                <Input value={customerEditForm.id} disabled />
              </div>
              <div className="grid gap-2">
                <Label>Nazwa</Label>
                <Input
                  value={customerEditForm.name}
                  onChange={(event) =>
                    setCustomerEditForm((prev) => ({ ...prev, name: event.target.value }))
                  }
                  disabled={!canManageCustomers}
                />
              </div>
              <div className="grid gap-2 md:col-span-2">
                <Label>Dane kontaktowe</Label>
                <Input
                  value={customerEditForm.contact_data}
                  onChange={(event) =>
                    setCustomerEditForm((prev) => ({
                      ...prev,
                      contact_data: event.target.value,
                    }))
                  }
                  disabled={!canManageCustomers}
                />
              </div>
              <div className="flex flex-wrap items-center gap-3 md:col-span-2">
                <Button
                  onClick={handleUpdateCustomer}
                  disabled={!canManageCustomers || loading || !customerEditForm.id}
                >
                  Zapisz zmiany
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteCustomer}
                  disabled={!canManageCustomers || loading || !customerEditForm.id}
                >
                  Usun klienta
                </Button>
              </div>
          </SectionCard>
        )}
      </div>

      {customerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xl rounded-2xl border bg-white shadow-xl">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <div>
                <h3 className="text-lg font-semibold">Dodaj klienta</h3>
                <p className="text-sm text-muted-foreground">
                  Klienci sa wymagani przy tworzeniu zamowien.
                </p>
              </div>
              <Button variant="ghost" onClick={() => setCustomerModalOpen(false)}>
                Zamknij
              </Button>
            </div>
            <div className="grid gap-4 p-6 md:grid-cols-2">
              <div className="grid gap-2">
                <Label>Nazwa klienta</Label>
                <Input
                  value={customerForm.name}
                  onChange={(event) =>
                    setCustomerForm((prev) => ({ ...prev, name: event.target.value }))
                  }
                  disabled={!canManageCustomers}
                />
              </div>
              <div className="grid gap-2">
                <Label>Dane kontaktowe</Label>
                <Input
                  value={customerForm.contact_data}
                  onChange={(event) =>
                    setCustomerForm((prev) => ({ ...prev, contact_data: event.target.value }))
                  }
                  disabled={!canManageCustomers}
                />
              </div>
              <div className="flex flex-wrap items-center gap-3 md:col-span-2">
                <Button
                  onClick={handleCreateCustomer}
                  disabled={!canManageCustomers || loading}
                >
                  Dodaj klienta
                </Button>
                {customerMessage && (
                  <p className="text-sm text-emerald-600">{customerMessage}</p>
                )}
                {!canManageCustomers && (
                  <p className="text-sm text-muted-foreground">
                    Brak uprawnien do dodawania klientow.
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
