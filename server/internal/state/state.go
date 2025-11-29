package state

import (
	"sync"
	"time"

	agentpb "netshield/agent/proto"
)

type DeviceStatus struct {
	DeviceID string                 `json:"device_id"`
	UserID   string                 `json:"user_id"`
	Domain   string                 `json:"domain"`
	LastSeen time.Time              `json:"last_seen"`
	Metric   *agentpb.NetworkMetric `json:"metric"`
}

type State struct {
	mu      sync.RWMutex
	byDevID map[string]*DeviceStatus
}

func NewState() *State {
	return &State{
		byDevID: make(map[string]*DeviceStatus),
	}
}

func (s *State) Update(m *agentpb.NetworkMetric) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.byDevID[m.DeviceId] = &DeviceStatus{
		DeviceID: m.DeviceId,
		UserID:   m.UserId,
		Domain:   m.Domain,
		LastSeen: time.Unix(m.TimestampUnix, 0),
		Metric:   m,
	}
}

func (s *State) Snapshot() []*DeviceStatus {
	s.mu.RLock()
	defer s.mu.RUnlock()
	out := make([]*DeviceStatus, 0, len(s.byDevID))
	for _, v := range s.byDevID {
		out = append(out, v)
	}
	return out
}
