package main

import (
	"encoding/json"
	"log"
	"net/http"
	"time"
)

type Response struct {
	Message string `json:"message"`
}

const maxConnections = 10

var sem = make(chan struct{}, maxConnections)

func requestLogger(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		log.Printf("Started %s %s", r.Method, r.URL.Path)
		next.ServeHTTP(w, r)
		log.Printf("Completed in %s", time.Since(start))
	})
}

func pingHandler(w http.ResponseWriter, r *http.Request) {
	sem <- struct{}{}
	defer func() { <-sem }()

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(Response{Message: "pong"})
}

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/ping", pingHandler)

	// Оборачиваем логирование
	loggedMux := requestLogger(mux)

	port := ":8080"
	log.Printf("Starting server on %s\n", port)
	err := http.ListenAndServe(port, loggedMux)
	if err != nil {
		log.Fatal(err)
	}
}
