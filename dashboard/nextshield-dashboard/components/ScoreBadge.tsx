import React from "react";

type ScoreBadgeProps = {
  value: number | null | undefined;
};

const scoreClass = (v: number) =>
  v >= 80
    ? "bg-emerald-600/20 text-emerald-300 shadow-[0_0_4px_#0affcf]"
    : v >= 60
    ? "bg-yellow-600/20 text-yellow-300"
    : v >= 40
    ? "bg-orange-600/20 text-orange-300"
    : "bg-red-600/20 text-red-300 shadow-[0_0_6px_#ff4d6d]";

export function ScoreBadge({ value }: ScoreBadgeProps) {
  const v = typeof value === "number" ? value : 0;
  return (
    <span
      className={`px-2 py-1 rounded-xl font-bold inline-flex items-center justify-center min-w-[2.5rem] ${scoreClass(
        v
      )}`}
    >
      {v}
    </span>
  );
}
