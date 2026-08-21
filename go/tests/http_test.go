package tests

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"atelier.example/lane/app"
	apphttp "atelier.example/lane/app/http"
)

// get runs one request against the router and returns status plus decoded body.
func get(t *testing.T, state *app.State, target string) (int, map[string]any) {
	t.Helper()
	recorder := httptest.NewRecorder()
	apphttp.NewRouter(state).ServeHTTP(recorder, httptest.NewRequest(http.MethodGet, target, nil))
	body := map[string]any{}
	if err := json.Unmarshal(recorder.Body.Bytes(), &body); err != nil {
		t.Fatalf("decode %s: %v (%s)", target, err, recorder.Body.String())
	}
	return recorder.Code, body
}

func TestReportEndpointResolvesByReference(t *testing.T) {
	status, body := get(t, app.SeededState(), "/report/AT-2026-000001")
	if status != http.StatusOK {
		t.Fatalf("status = %d, want 200", status)
	}
	if body["reference"] != "AT-2026-000001" {
		t.Errorf("reference = %v", body["reference"])
	}
	if body["device"] != "Framework 13 (SER-0001)" {
		t.Errorf("device = %v", body["device"])
	}
	if body["status"] != "Completed since intake" {
		t.Errorf("status = %v", body["status"])
	}
	if body["total"] != "349.00 EUR" {
		t.Errorf("total = %v, want 349.00 EUR", body["total"])
	}
	if body["calculator"] != "standard" {
		t.Errorf("calculator = %v", body["calculator"])
	}
}

func TestRushBindingChangesTheTotal(t *testing.T) {
	status, body := get(t, app.SeededRushState(), "/report/AT-2026-000002")
	if status != http.StatusOK {
		t.Fatalf("status = %d, want 200", status)
	}
	if body["total"] != "292.81 EUR" {
		t.Errorf("total = %v, want 292.81 EUR", body["total"])
	}
	if body["calculator"] != "rush" {
		t.Errorf("calculator = %v, want rush", body["calculator"])
	}
}

func TestUnknownReferenceIs404(t *testing.T) {
	status, body := get(t, app.SeededState(), "/report/AT-2026-999999")
	if status != http.StatusNotFound {
		t.Fatalf("status = %d, want 404", status)
	}
	message, _ := body["error"].(string)
	if !strings.Contains(message, "999999") {
		t.Errorf("error = %v", body["error"])
	}
	if body["key"] != "AT-2026-999999" {
		t.Errorf("key = %v (errors.As should recover it)", body["key"])
	}
}

func TestOrdersAndReportRoutes(t *testing.T) {
	state := app.SeededState()
	recorder := httptest.NewRecorder()
	apphttp.NewRouter(state).ServeHTTP(recorder, httptest.NewRequest(http.MethodGet, "/api/orders", nil))
	var orders []map[string]any
	if err := json.Unmarshal(recorder.Body.Bytes(), &orders); err != nil {
		t.Fatalf("decode orders: %v", err)
	}
	if len(orders) != 4 {
		t.Errorf("orders = %d, want 4", len(orders))
	}

	status, body := get(t, state, "/api/reports/gross-profit")
	if status != http.StatusOK {
		t.Fatalf("status = %d, want 200", status)
	}
	if body["title"] != "Gross profit" {
		t.Errorf("title = %v", body["title"])
	}
	rows, _ := body["rows"].([]any)
	if len(rows) != 3 {
		t.Errorf("rows = %d, want 3", len(rows))
	}
}

func TestPostNoteAndHealth(t *testing.T) {
	state := app.SeededState()
	recorder := httptest.NewRecorder()
	request := httptest.NewRequest(http.MethodPost, "/api/orders/1/notes", strings.NewReader(`{"body":"checked","author":"nel"}`))
	apphttp.NewRouter(state).ServeHTTP(recorder, request)
	if recorder.Code != http.StatusCreated {
		t.Fatalf("status = %d, want 201", recorder.Code)
	}

	status, body := get(t, state, "/health")
	if status != http.StatusOK {
		t.Fatalf("health status = %d, want 200", status)
	}
	if body["status"] != "ok" {
		t.Errorf("health = %v", body["status"])
	}
}
