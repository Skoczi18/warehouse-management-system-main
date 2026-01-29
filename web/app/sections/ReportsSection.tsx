"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ReportsSectionProps = {
  reportType: string;
  setReportType: (value: string) => void;
  reportFilters: {
    action: string;
    user_id: string;
    status: string;
    supplier_id: string;
    customer_id: string;
    priority: string;
  };
  setReportFilters: React.Dispatch<
    React.SetStateAction<{
      action: string;
      user_id: string;
      status: string;
      supplier_id: string;
      customer_id: string;
      priority: string;
    }>
  >;
  refresh: () => void;
  loading: boolean;
  pagination: {
    page: number;
    limit: number;
  };
  setPagination: React.Dispatch<
    React.SetStateAction<{
      page: number;
      limit: number;
    }>
  >;
  getPaginationInfo: () => {
    currentPage: number;
    totalPages: number;
  };
};

export default function ReportsSection({
  reportType,
  setReportType,
  reportFilters,
  setReportFilters,
  refresh,
  loading,
  pagination,
  setPagination,
  getPaginationInfo,
}: ReportsSectionProps) {
  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap gap-3">
        {["stock", "deliveries", "orders", "audit"].map((type) => (
          <Button
            key={type}
            variant={reportType === type ? "default" : "outline"}
            onClick={() => setReportType(type)}
          >
            {type.toUpperCase()}
          </Button>
        ))}
      </div>
      <p className="text-sm text-muted-foreground">
        Raporty prezentuja dane przekrojowe. Wybierz typ raportu, ustaw filtry,
        a nastepnie kliknij „Filtruj”.
      </p>
      {reportType === "audit" && (
        <div className="flex flex-wrap items-end gap-3">
          <div className="grid gap-2">
            <Label>Akcja</Label>
            <Input
              value={reportFilters.action}
              onChange={(event) =>
                setReportFilters((prev) => ({ ...prev, action: event.target.value }))
              }
              placeholder="LOGIN_OK"
            />
            <p className="text-xs text-muted-foreground">
              Np. LOGIN_OK, CREATE_ORDER, ISSUE_ORDER.
            </p>
          </div>
          <div className="grid gap-2">
            <Label>ID uzytkownika</Label>
            <Input
              value={reportFilters.user_id}
              onChange={(event) =>
                setReportFilters((prev) => ({ ...prev, user_id: event.target.value }))
              }
            />
            <p className="text-xs text-muted-foreground">
              Filtruj zdarzenia konkretnego uzytkownika.
            </p>
          </div>
          <Button onClick={refresh} disabled={loading}>
            Filtruj
          </Button>
        </div>
      )}
      {reportType === "deliveries" && (
        <div className="flex flex-wrap items-end gap-3">
          <div className="grid gap-2">
            <Label>Status</Label>
            <Input
              value={reportFilters.status}
              onChange={(event) =>
                setReportFilters((prev) => ({ ...prev, status: event.target.value }))
              }
              placeholder="ZATWIERDZONA"
            />
            <p className="text-xs text-muted-foreground">
              Np. NOWA, W_TRAKCIE, ZATWIERDZONA, ANULOWANA.
            </p>
          </div>
          <div className="grid gap-2">
            <Label>ID dostawcy</Label>
            <Input
              value={reportFilters.supplier_id}
              onChange={(event) =>
                setReportFilters((prev) => ({
                  ...prev,
                  supplier_id: event.target.value,
                }))
              }
            />
            <p className="text-xs text-muted-foreground">
              Numer dostawcy z listy dostawcow.
            </p>
          </div>
          <Button onClick={refresh} disabled={loading}>
            Filtruj
          </Button>
        </div>
      )}
      {reportType === "orders" && (
        <div className="flex flex-wrap items-end gap-3">
          <div className="grid gap-2">
            <Label>Status</Label>
            <Input
              value={reportFilters.status}
              onChange={(event) =>
                setReportFilters((prev) => ({ ...prev, status: event.target.value }))
              }
              placeholder="ZREALIZOWANE"
            />
            <p className="text-xs text-muted-foreground">
              Np. NOWE, OCZEKUJACE, ZREALIZOWANE, ANULOWANE.
            </p>
          </div>
          <div className="grid gap-2">
            <Label>ID klienta</Label>
            <Input
              value={reportFilters.customer_id}
              onChange={(event) =>
                setReportFilters((prev) => ({
                  ...prev,
                  customer_id: event.target.value,
                }))
              }
            />
            <p className="text-xs text-muted-foreground">
              Numer klienta z listy klientów.
            </p>
          </div>
          <div className="grid gap-2">
            <Label>Priorytet</Label>
            <Input
              value={reportFilters.priority}
              onChange={(event) =>
                setReportFilters((prev) => ({
                  ...prev,
                  priority: event.target.value,
                }))
              }
              placeholder="true/false"
            />
            <p className="text-xs text-muted-foreground">
              true = priorytetowe, false = standardowe.
            </p>
          </div>
          <Button onClick={refresh} disabled={loading}>
            Filtruj
          </Button>
        </div>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <Label>Limit wynikow</Label>
        {(() => {
          const pageInfo = getPaginationInfo();
          return (
            <>
              <select
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                value={pagination.limit}
                onChange={(event) =>
                  setPagination({
                    page: 1,
                    limit: Number(event.target.value),
                  })
                }
              >
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <Button
                variant="outline"
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    page: Math.max(1, pageInfo.currentPage - 1),
                  }))
                }
                disabled={pageInfo.currentPage <= 1}
              >
                Poprzednia
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    page: Math.min(pageInfo.totalPages, pageInfo.currentPage + 1),
                  }))
                }
                disabled={pageInfo.currentPage >= pageInfo.totalPages}
              >
                Nastepna
              </Button>
              <span className="text-sm text-muted-foreground">
                Strona {pageInfo.currentPage} / {pageInfo.totalPages}
              </span>
            </>
          );
        })()}
      </div>
    </div>
  );
}
