// Package reports carries the 24 concrete reports. Each one embeds a base
// from atelier/support, declares only Rows, and registers itself in an init()
// function; Slug, Title, CacheKey and TTLSeconds arrive by promotion.
package reports

import (
	"fmt"

	"atelier.example/lane/atelier/contracts"
	"atelier.example/lane/atelier/dataset"
	"atelier.example/lane/atelier/support"
)

// Compile-time proof of satisfaction: this assertion is the ONLY textual
// link between the struct and the interface it satisfies.
var _ contracts.ReportContract = (*PaymentLatencyReport)(nil)

// PaymentLatencyReport reports payment latency.
type PaymentLatencyReport struct {
	support.BaseReport
}

// NewPaymentLatencyReport builds the report with its slug and title.
func NewPaymentLatencyReport() *PaymentLatencyReport {
	return &PaymentLatencyReport{BaseReport: support.NewBaseReport("payment-latency", "Payment latency")}
}

// Rows is the only contract method this type declares.
func (r *PaymentLatencyReport) Rows(data *dataset.Dataset) []contracts.ReportRow {
	rows := make([]contracts.ReportRow, 0, len(data.Invoices))
	for _, invoice := range data.Invoices {
		delay := 0.0
		if !invoice.Paid {
			delay = float64(invoice.ID) * 3.5
		}
		rows = append(rows, contracts.Row(fmt.Sprintf("invoice-%d", invoice.ID), delay))
	}
	return rows
}

// init registers this report; the package-level registry is built by the 24
// init functions in this package, in file-name order.
func init() {
	Register(NewPaymentLatencyReport())
}
