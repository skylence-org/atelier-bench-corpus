// Package http is the lane's HTTP surface. Its name SHADOWS the standard
// library's: inside these files the identifier `http` is net/http, and every
// caller outside has to alias one of the two at its own import site.
package http

import (
	"encoding/json"
	"net/http"

	"atelier.example/lane/app"
)

// Handler is a named FUNCTION TYPE that satisfies http.Handler, the same
// shape as http.HandlerFunc: the method set hangs off a func, not a struct.
type Handler func(writer http.ResponseWriter, request *http.Request)

// ServeHTTP makes every Handler an http.Handler.
func (h Handler) ServeHTTP(writer http.ResponseWriter, request *http.Request) {
	h(writer, request)
}

// Compile-time proof that the function type satisfies the stdlib interface.
var _ http.Handler = Handler(nil)

// NewRouter builds the application mux. The five routes are registered on an
// explicit *http.ServeMux with Go 1.22 method-prefixed patterns.
func NewRouter(state *app.State) *http.ServeMux {
	mux := http.NewServeMux()
	mux.Handle("GET /report/{reference}", ShowReport(state))
	mux.Handle("GET /api/orders", ListOrders(state))
	mux.Handle("POST /api/orders/{id}/notes", AddNote(state))
	mux.Handle("GET /api/reports/{slug}", ShowReportData(state))
	mux.Handle("GET /health", Health(state))
	return mux
}

// RegisterDefault registers the health check on the DEFAULT mux, the other
// registration shape a Go service uses.
func RegisterDefault(state *app.State) {
	http.HandleFunc("/health", Health(state))
}

// writeJSON renders any payload as JSON with the right content type.
func writeJSON(writer http.ResponseWriter, status int, payload any) {
	writer.Header().Set("Content-Type", "application/json")
	writer.WriteHeader(status)
	encoder := json.NewEncoder(writer)
	encoder.SetEscapeHTML(false)
	_ = encoder.Encode(payload)
}

// Health answers the readiness probe.
func Health(state *app.State) Handler {
	return func(writer http.ResponseWriter, request *http.Request) {
		writeJSON(writer, http.StatusOK, map[string]any{
			"status": "ok",
			"orders": len(state.Data.Orders),
		})
	}
}
