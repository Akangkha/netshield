package main

import (
	"encoding/json"
	"log"
	"net"
	"net/http"

	agentpb "netshield/agent/proto"
	"netshield/server/internal/grpc"
	"netshield/server/internal/state"
	"google.golang.org/grpc"
)

func main() {
	st := state.NewState()

	// gRPC server
	go startGRPC(st)

	// HTTP server 
	startHTTP(st)
}

func startGRPC(st *state.State) {
	addr := ":50051"
	lis, err := net.Listen("tcp", addr)
	if err != nil {
		log.Fatalf("[server] failed to listen: %v", err)
	}

	s := grpc.NewServer()
	agentpb.RegisterAgentServiceServer(s, grpcserver.NewAgentServiceServer(st))

	log.Println("[server] gRPC listening on", addr)
	if err := s.Serve(lis); err != nil {
		log.Fatalf("[server] gRPC serve failed: %v", err)
	}
}

func startHTTP(st *state.State) {
	http.HandleFunc("/status", func(w http.ResponseWriter, r *http.Request) {
		snap := st.Snapshot()
		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(snap); err != nil {
			http.Error(w, "encode error", http.StatusInternalServerError)
		}
	})

	addr := ":8080"
	log.Println("[server] HTTP status endpoint on", addr, "GET /status")
	if err := http.ListenAndServe(addr, nil); err != nil {
		log.Fatalf("[server] http serve failed: %v", err)
	}
}
