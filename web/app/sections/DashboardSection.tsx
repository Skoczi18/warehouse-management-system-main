"use client";

import * as React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type DashboardSectionProps = {
  data: any[];
};

export default function DashboardSection({ data }: DashboardSectionProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {data.map((entry, index) => (
        <Card key={`${entry?.label ?? "metric"}-${index}`} className="border-0 bg-secondary/60">
          <CardHeader>
            <CardTitle className="text-sm uppercase text-muted-foreground">
              {entry.label}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">{entry.value}</CardContent>
        </Card>
      ))}
    </div>
  );
}
