"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SectionCard from "@/app/components/SectionCard";

type AdminSectionProps = {
  adminUserForm: {
    login: string;
    password: string;
    role: string;
  };
  setAdminUserForm: React.Dispatch<
    React.SetStateAction<{
      login: string;
      password: string;
      role: string;
    }>
  >;
  adminUpdateForm: {
    user_id: string;
    role: string;
    password: string;
    is_active: boolean;
  };
  setAdminUpdateForm: React.Dispatch<
    React.SetStateAction<{
      user_id: string;
      role: string;
      password: string;
      is_active: boolean;
    }>
  >;
  handleCreateAdminUser: () => void;
  handleUpdateAdminUser: () => void;
  canManageAdmin: boolean;
  adminMessage: string | null;
  loading: boolean;
};

export default function AdminSection({
  adminUserForm,
  setAdminUserForm,
  adminUpdateForm,
  setAdminUpdateForm,
  handleCreateAdminUser,
  handleUpdateAdminUser,
  canManageAdmin,
  adminMessage,
  loading,
}: AdminSectionProps) {
  return (
    <div className="grid gap-4">
      <SectionCard
        title="Dodaj uzytkownika"
        description="Wymagana rola ADMIN."
        contentClassName="grid gap-4 md:grid-cols-2"
      >
          <div className="grid gap-2">
            <Label>Login</Label>
            <Input
              value={adminUserForm.login}
              onChange={(event) =>
                setAdminUserForm((prev) => ({ ...prev, login: event.target.value }))
              }
              disabled={!canManageAdmin}
            />
          </div>
          <div className="grid gap-2">
            <Label>Haslo</Label>
            <Input
              type="password"
              value={adminUserForm.password}
              onChange={(event) =>
                setAdminUserForm((prev) => ({ ...prev, password: event.target.value }))
              }
              disabled={!canManageAdmin}
            />
          </div>
          <div className="grid gap-2 md:col-span-2">
            <Label>Rola</Label>
            <select
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
              value={adminUserForm.role}
              onChange={(event) =>
                setAdminUserForm((prev) => ({ ...prev, role: event.target.value }))
              }
              disabled={!canManageAdmin}
            >
              <option value="MAGAZYNIER">MAGAZYNIER</option>
              <option value="KIEROWNIK">KIEROWNIK</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>
          <div className="flex flex-wrap items-center gap-3 md:col-span-2">
            <Button onClick={handleCreateAdminUser} disabled={!canManageAdmin || loading}>
              Dodaj
            </Button>
            {!canManageAdmin && (
              <p className="text-sm text-muted-foreground">
                Brak uprawnien do zarzadzania uzytkownikami.
              </p>
            )}
            {adminMessage && <p className="text-sm text-emerald-600">{adminMessage}</p>}
          </div>
      </SectionCard>
      <SectionCard
        title="Aktualizuj uzytkownika"
        description="Ustaw role, aktywnosc lub nowe haslo."
        contentClassName="grid gap-4 md:grid-cols-2"
      >
          <div className="grid gap-2">
            <Label>ID uzytkownika</Label>
            <Input
              value={adminUpdateForm.user_id}
              onChange={(event) =>
                setAdminUpdateForm((prev) => ({
                  ...prev,
                  user_id: event.target.value,
                }))
              }
              disabled={!canManageAdmin}
            />
          </div>
          <div className="grid gap-2">
            <Label>Rola</Label>
            <select
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
              value={adminUpdateForm.role}
              onChange={(event) =>
                setAdminUpdateForm((prev) => ({
                  ...prev,
                  role: event.target.value,
                }))
              }
              disabled={!canManageAdmin}
            >
              <option value="MAGAZYNIER">MAGAZYNIER</option>
              <option value="KIEROWNIK">KIEROWNIK</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>
          <div className="grid gap-2">
            <Label>Nowe haslo (opcjonalnie)</Label>
            <Input
              type="password"
              value={adminUpdateForm.password}
              onChange={(event) =>
                setAdminUpdateForm((prev) => ({
                  ...prev,
                  password: event.target.value,
                }))
              }
              disabled={!canManageAdmin}
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              id="admin-active"
              type="checkbox"
              className="h-4 w-4"
              checked={adminUpdateForm.is_active}
              onChange={(event) =>
                setAdminUpdateForm((prev) => ({
                  ...prev,
                  is_active: event.target.checked,
                }))
              }
              disabled={!canManageAdmin}
            />
            <Label htmlFor="admin-active">Aktywny</Label>
          </div>
          <div className="flex flex-wrap items-center gap-3 md:col-span-2">
            <Button onClick={handleUpdateAdminUser} disabled={!canManageAdmin || loading}>
              Zapisz zmiany
            </Button>
          </div>
      </SectionCard>
    </div>
  );
}
