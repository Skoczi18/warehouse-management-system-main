"use client";

import * as React from "react";

type TableContainerProps = {
  children: React.ReactNode;
  maxHeightClassName?: string;
  className?: string;
};

export default function TableContainer({
  children,
  maxHeightClassName,
  className,
}: TableContainerProps) {
  return (
    <div className={["overflow-hidden rounded-2xl border bg-white", className].filter(Boolean).join(" ")}>
      <div className={maxHeightClassName ?? "max-h-[420px] overflow-auto"}>{children}</div>
    </div>
  );
}
