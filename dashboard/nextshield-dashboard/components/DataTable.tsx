import { DeviceStatus } from "../lib/api";
import { ScoreBadge } from "./ScoreBadge";
import React from "react";

type DataTableProps = {
  rows: DeviceStatus[];
};

export function DataTable({ rows }: DataTableProps) {
  if (!rows.length)
    return (
      <div className="text-slate-400 text-sm">
        No devices reporting yet
      </div>
    );

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60 shadow-[0_0_10px_#00ffcc40]">
      <table className="min-w-full text-xs">
        <thead className="bg-slate-900/80">
          <tr>
            <th className="px-3 py-3 text-left font-medium">Device</th>
            <th className="px-3 py-3 text-left font-medium">User</th>
            <th className="px-3 py-3 text-left font-medium">Domain</th>
            <th className="px-3 py-3 text-left font-medium">SSID</th>
            <th className="px-3 py-3 text-left font-medium">Signal</th>
            <th className="px-3 py-3 text-left font-medium">Ping</th>
            <th className="px-3 py-3 text-left font-medium">Score</th>
            <th className="px-3 py-3 text-left font-medium">Last Seen</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((d) => (
            <tr
              key={d.device_id}
              className={`border-t border-slate-800 hover:bg-slate-800/40 hover:shadow-[0_0_10px_#00ffcc] transition ${
                (d.experience_score ?? 0) < 40
                  ? "bg-red-900/20 shadow-[0_0_10px_#ff4d6d]"
                  : ""
              }`}
            >
              <td className="px-3 py-2 font-mono text-[11px]">
                {d.device_id}
              </td>
              <td className="px-3 py-2">{d.user_id ?? "-"}</td>
              <td className="px-3 py-2">{d.domain ?? "-"}</td>
              <td className="px-3 py-2">{d.ssid ?? "-"}</td>
              <td className="px-3 py-2">{d.signal_percent}%</td>
              <td className="px-3 py-2">{d.avg_ping_ms}ms</td>
              <td className="px-3 py-2">
                <ScoreBadge value={d.experience_score} />
              </td>
              <td className="px-3 py-2 text-slate-400">
                {new Date(d.last_seen).toLocaleTimeString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
