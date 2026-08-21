package http

import (
	"encoding/json"
	"net/http"
	"strconv"

	"atelier.example/lane/app"
	"atelier.example/lane/atelier/reports"
	"atelier.example/lane/core/failure"
)

// OrderView is one row of GET /api/orders.
type OrderView struct {
	ID        int    `json:"id"`
	Reference string `json:"reference"`
	Status    string `json:"status"`
	Priority  string `json:"priority"`
}

// NoteInput is the body of POST /api/orders/{id}/notes.
type NoteInput struct {
	Body   string `json:"body"`
	Author string `json:"author"`
}

// ListOrders answers GET /api/orders.
func ListOrders(state *app.State) Handler {
	return func(writer http.ResponseWriter, request *http.Request) {
		views := make([]OrderView, 0, len(state.Data.Orders))
		for _, order := range state.Data.Orders {
			views = append(views, OrderView{
				ID:        order.ID,
				Reference: order.Reference(),
				Status:    order.Status.String(),
				Priority:  order.Priority.String(),
			})
		}
		writeJSON(writer, http.StatusOK, views)
	}
}

// AddNote answers POST /api/orders/{id}/notes.
func AddNote(state *app.State) Handler {
	return func(writer http.ResponseWriter, request *http.Request) {
		id, err := strconv.Atoi(request.PathValue("id"))
		if err != nil {
			writeError(writer, failure.NewNotFound("repair order", request.PathValue("id")))
			return
		}
		var input NoteInput
		if decodeErr := json.NewDecoder(request.Body).Decode(&input); decodeErr != nil {
			writeError(writer, failure.Annotate("note", decodeErr))
			return
		}
		for _, order := range state.Data.Orders {
			if order.ID != id {
				continue
			}
			writeJSON(writer, http.StatusCreated, map[string]any{
				"order": order.Reference(),
				"note":  input.Body,
			})
			return
		}
		writeError(writer, failure.NewNotFound("repair order", strconv.Itoa(id)))
	}
}

// ShowReportData answers GET /api/reports/{slug} from the report registry,
// which the init functions of the reports package filled.
func ShowReportData(state *app.State) Handler {
	return func(writer http.ResponseWriter, request *http.Request) {
		slug := request.PathValue("slug")
		report, found := reports.BySlug(slug)
		if !found {
			writeError(writer, failure.NewNotFound("report", slug))
			return
		}
		writeJSON(writer, http.StatusOK, map[string]any{
			"slug":  report.Slug(),
			"title": report.Title(),
			"rows":  report.Rows(state.Data),
		})
	}
}
