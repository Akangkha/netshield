-- Current status 
CREATE TABLE device_status (
    device_id        text PRIMARY KEY,
    user_id          text,
    domain           text,
    last_seen        timestamptz NOT NULL,
    ssid             text,
    interface_name   text,
    signal_percent   int,
    avg_ping_ms      int,
    experience_score int
);

-- Raw time-series metrics
CREATE TABLE metrics_raw (
    id               bigserial PRIMARY KEY,
    device_id        text NOT NULL,
    user_id          text,
    domain           text,
    ts               timestamptz NOT NULL,
    ssid             text,
    interface_name   text,
    signal_percent   int,
    avg_ping_ms      int,
    experience_score int
);

-- Indexes
CREATE INDEX ON metrics_raw(device_id, ts DESC);
CREATE INDEX ON metrics_raw(domain, ts DESC);
