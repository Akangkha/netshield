import React from "react";
import { ReactNode } from "react";

type DomainFilterProps = {
  value: string;
  onChange: (value: string) => void;
  options?: string[];
};

const baseOptions = ["all", "exam", "remote-work", "telemedicine"];

export function DomainFilter(props: DomainFilterProps) {
  const options = props.options ?? baseOptions;

  const renderLabel = (v: string): ReactNode => {
    if (v === "all") return "all";
    if (v === "remote-work") return "remote";
    return v;
  };

  return (
    <div className="flex gap-2 text-xs">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => props.onChange(opt)}
          className={`px-3 py-1 rounded-full transition border ${
            props.value === opt
              ? "border-emerald-500 bg-emerald-500/20 text-emerald-300 shadow-[0_0_6px_#00ffbf]"
              : "border-slate-700 bg-slate-800/60 text-slate-300 hover:border-emerald-400"
          }`}
        >
          {renderLabel(opt)}
        </button>
      ))}
    </div>
  );
}
