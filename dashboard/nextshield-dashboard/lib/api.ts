export type DeviceStatus = {
  device_id: string;
  user_id: string | null;
  domain: string | null;
  last_seen: string;
  ssid: string | null;
  interface_name: string | null;
  signal_percent: number;
  avg_ping_ms: number;
  experience_score: number;
};

export async function fetchStatus(): Promise<DeviceStatus[]> {
  const res = await fetch("http://localhost:8082/api/status", { cache: "no-store" });
  if (!res.ok) throw new Error(`status fetch failed: ${res.status}`);
  return res.json();
}
