"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type LoginCardProps = {
  loginForm: {
    username: string;
    password: string;
  };
  setLoginForm: React.Dispatch<
    React.SetStateAction<{
      username: string;
      password: string;
    }>
  >;
  error: string | null;
  loading: boolean;
  onLogin: () => void;
};

export default function LoginCard({
  loginForm,
  setLoginForm,
  error,
  loading,
  onLogin,
}: LoginCardProps) {
  return (
    <Card className="max-w-xl border-0 bg-white/90 shadow-lg">
      <CardHeader>
        <CardTitle>Zaloguj sie</CardTitle>
        <CardDescription>Uzyj konta ADMIN/KIEROWNIK/MAGAZYNIER.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid gap-2">
          <Label htmlFor="login">Login</Label>
          <Input
            id="login"
            placeholder="admin"
            value={loginForm.username}
            onChange={(event) =>
              setLoginForm((prev) => ({ ...prev, username: event.target.value }))
            }
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Haslo</Label>
          <Input
            id="password"
            type="password"
            value={loginForm.password}
            onChange={(event) =>
              setLoginForm((prev) => ({ ...prev, password: event.target.value }))
            }
          />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button onClick={onLogin} disabled={loading}>
          {loading ? "Logowanie..." : "Zaloguj"}
        </Button>
      </CardContent>
    </Card>
  );
}
