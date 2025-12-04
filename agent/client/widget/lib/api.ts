export type DeviceStatus = {
  device_id: string;
  user_id: string;
  domain: string;
  last_seen: string;
  ssid: string;
  interface_name: string;
  signal_percent: number;
  avg_ping_ms: number;
  score: number;
};

export async function fetchStatus(): Promise<DeviceStatus> {
  const res = await fetch("http://localhost:9090/current", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Status fetch failed: ${res.status}`);
  }
  return res.json();
}
