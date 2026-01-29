"use client";

import * as React from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type SectionCardProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  headerAction?: React.ReactNode;
};

export default function SectionCard({
  title,
  description,
  children,
  className,
  contentClassName,
  headerAction,
}: SectionCardProps) {
  return (
    <Card className={["border-0 bg-secondary/60", className].filter(Boolean).join(" ")}>
      <CardHeader className={headerAction ? "flex flex-row items-start justify-between" : undefined}>
        <div className="grid gap-1">
          <CardTitle className="text-base">{title}</CardTitle>
          {description && (
            <CardDescription className="text-sm text-muted-foreground">
              {description}
            </CardDescription>
          )}
        </div>
        {headerAction}
      </CardHeader>
      <CardContent className={contentClassName}>{children}</CardContent>
    </Card>
  );
}
