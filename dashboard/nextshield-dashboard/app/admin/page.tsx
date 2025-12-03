"use client";
import React from "react";
import { useEffect, useMemo, useState } from "react";
import { DomainFilter } from "../../components/DomainFilter";
import { DataTable } from "../../components/DataTable";
import { supabase } from "../../lib/client";

const dummy = [
  {
    device_id: "device-001",
    user_id: "Arjun",
    domain: "exam",
    last_seen: new Date().toISOString(),
    ssid: "KIIT-DU",
    interface_name: "Wi-Fi",
    signal_percent: 24,
    avg_ping_ms: 302,
    experience_score: 28,
  },
  {
    device_id: "device-002",
    user_id: "Riya",
    domain: "remote-work",
    last_seen: new Date().toISOString(),
    ssid: "JioFiber-5G",
    interface_name: "Wi-Fi",
    signal_percent: 81,
    avg_ping_ms: 26,
    experience_score: 92,
  },
  {
    device_id: "device-003",
    user_id: "Sagar",
    domain: "telemedicine",
    last_seen: new Date().toISOString(),
    ssid: "Airtel-Xtreme",
    interface_name: "Wi-Fi",
    signal_percent: 56,
    avg_ping_ms: 118,
    experience_score: 63,
  },
  {
    device_id: "device-004",
    user_id: "Neha",
    domain: "exam",
    last_seen: new Date().toISOString(),
    ssid: "Esperance",
    interface_name: "Wi-Fi",
    signal_percent: 39,
    avg_ping_ms: 211,
    experience_score: 44,
  },
];

export default function Admin() {
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [checking, setChecking] = useState(true);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const run = async () => {
      const { data } = await supabase.auth.getUser();
      setAuthed(!!data.user);
      setChecking(false);
    };
    run();
  }, []);

  const data = useMemo(
    () =>
      dummy
        .filter((d) =>
          filter === "all" ? true : d.domain?.toLowerCase() === filter
        )
        .filter((d) => {
          if (!query.trim()) return true;
          const q = query.toLowerCase();
          return (
            d.device_id.toLowerCase().includes(q) ||
            d.user_id?.toLowerCase().includes(q) ||
            d.ssid?.toLowerCase().includes(q)
          );
        }),
    [filter, query]
  );

  if (checking)
    return (
      <main className="min-h-screen bg-[#020617] flex items-center justify-center text-slate-300 text-sm">
        Checking access…
      </main>
    );

  if (!authed)
    return (
      <main className="min-h-screen bg-[#020617] flex items-center justify-center text-slate-300 text-sm">
        <div className="text-center space-y-2">
          <p>Unauthorized. Please sign in to access the admin console.</p>
          <a
            href="/login"
            className="inline-flex px-3 py-1 rounded-md bg-emerald-500/90 text-slate-900 text-xs font-semibold hover:bg-emerald-400"
          >
            Go to login
          </a>
        </div>
      </main>
    );

  return (
    <main className="min-h-screen bg-[#020617] text-slate-100 flex justify-center px-6 py-10">
      <div className="w-full max-w-7xl space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              WifiShield Network Intelligence Console
            </h1>
            <p className="text-slate-400 text-sm">
              Real-time telemetry & performance scoring across connected devices
            </p>
          </div>
          <div className="text-right text-xs text-slate-400 space-y-1">
            <p>{new Date().toLocaleTimeString()}</p>
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                setAuthed(false);
              }}
              className="px-3 py-1 rounded-md border border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              Sign out
            </button>
          </div>
        </header>

        <div className="flex flex-wrap justify-between items-center gap-3">
          <DomainFilter value={filter} onChange={setFilter} />
          <input
            type="text"
            placeholder="Search device, user or SSID"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-72 rounded-md border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-slate-100 placeholder:text-slate-500 focus:ring-emerald-500/50 focus:ring-2 outline-none"
          />
        </div>

        <DataTable rows={data} />
      </div>
    </main>
  );
}
