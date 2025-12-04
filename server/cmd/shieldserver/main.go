package main

import (
	"context"
	"encoding/json"
	"log"
	"net"
	"net/http"
	"os"
	"time"

	agentpb "netshield/agent/proto"
	"netshield/server/internal/db"
	grpcserver "netshield/server/internal/grpc"

	"google.golang.org/grpc"
)

func main() {
	ctx := context.Background()

	dsn := os.Getenv("NETSHIELD_DB_DSN")
	if dsn == "" {
		// Example: postgres://user:pass@localhost:5432/netshield?sslmode=disable
		log.Fatal("NETSHIELD_DB_DSN not set")
	}
	log.Println("Using DSN:", dsn)
	store, err := db.New(ctx, dsn)
	if err != nil {
		log.Fatalf("failed to connect to postgres: %v", err)
	}
	defer store.Close()

	// Start retention job
	go startRetentionJob(store)

	// Start gRPC server
	go startGRPCServer(store)

	// Start HTTP server
	startHTTPServer(store)
}

func startGRPCServer(store *db.Store) {
	addr := ":50051"
	lis, err := net.Listen("tcp", addr)
	if err != nil {
		log.Fatalf("[server] failed to listen: %v", err)
	}

	s := grpc.NewServer()
	agentpb.RegisterAgentServiceServer(s, grpcserver.NewAgentServiceServer(store))

	log.Println("[server] gRPC listening on", addr)
	if err := s.Serve(lis); err != nil {
		log.Fatalf("[server] gRPC serve failed: %v", err)
	}
}

func startHTTPServer(store *db.Store) {
	// GET /status -> list of current device_status
	http.HandleFunc("/status", func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()
		status, err := store.GetAllDeviceStatus(ctx)
		if err != nil {
			http.Error(w, "db error: "+err.Error(), http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(status); err != nil {
			http.Error(w, "encode error", http.StatusInternalServerError)
		}
	})

	addr := ":8082"
	log.Println("[server] HTTP status endpoint on", addr, "GET /status")
	if err := http.ListenAndServe(addr, nil); err != nil {
		log.Fatalf("[server] http serve failed: %v", err)
	}
}

// run a simple retention job every 6 hours, keeping 30 days of data
func startRetentionJob(store *db.Store) {
	ticker := time.NewTicker(6 * time.Hour)
	defer ticker.Stop()

	for {
		<-ticker.C
		log.Println("[server] running retention job: delete metrics older than 30 days")
		if err := store.DeleteOldMetrics(context.Background(), 30*24*time.Hour); err != nil {
			log.Println("[server] retention error:", err)
		}
	}
}
