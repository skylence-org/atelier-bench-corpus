package http

import (
	"net/http"

	"atelier.example/lane/app"
	"atelier.example/lane/core/failure"
)

// ReportView is the payload of GET /report/{reference}.
type ReportView struct {
	Reference  string `json:"reference"`
	Customer   string `json:"customer"`
	Device     string `json:"device"`
	Status     string `json:"status"`
	Total      string `json:"total"`
	Calculator string `json:"calculator"`
}

// ShowReport resolves an order by its reference and prices it through
// whichever calculator the container bound. The handler is a CLOSURE over
// state: the route table holds the closure, never a named function.
func ShowReport(state *app.State) Handler {
	return func(writer http.ResponseWriter, request *http.Request) {
		reference := request.PathValue("reference")
		order, found := state.Data.OrderByReference(reference)
		if !found {
			writeError(writer, failure.NewNotFound("repair order", reference))
			return
		}
		customer := ""
		for _, candidate := range state.Data.Customers {
			if candidate.ID == order.CustomerID {
				customer = candidate.DisplayName()
			}
		}
		device := ""
		for _, candidate := range state.Data.Devices {
			if candidate.ID == order.DeviceID {
				device = candidate.Label()
			}
		}
		writeJSON(writer, http.StatusOK, ReportView{
			Reference:  reference,
			Customer:   customer,
			Device:     device,
			Status:     state.Status.StatusLine(order.Status, "intake"),
			Total:      state.Money.Money(order.Total(state.Container.InvoiceCalculator())),
			Calculator: state.Container.InvoiceCalculator().Name(),
		})
	}
}
