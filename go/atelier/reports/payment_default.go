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
var _ contracts.ReportContract = (*PaymentDefaultReport)(nil)

// PaymentDefaultReport reports payment default.
type PaymentDefaultReport struct {
	support.BaseReport
}

// NewPaymentDefaultReport builds the report with its slug and title.
func NewPaymentDefaultReport() *PaymentDefaultReport {
	return &PaymentDefaultReport{BaseReport: support.NewBaseReport("payment-default", "Payment default")}
}

// Rows is the only contract method this type declares.
func (r *PaymentDefaultReport) Rows(data *dataset.Dataset) []contracts.ReportRow {
	rows := make([]contracts.ReportRow, 0, len(data.Invoices))
	for _, invoice := range data.Invoices {
		if invoice.Paid {
			continue
		}
		rows = append(rows, contracts.RowFromCents(fmt.Sprintf("invoice-%d", invoice.ID), invoice.Outstanding().Cents()))
	}
	return rows
}

// init registers this report; the package-level registry is built by the 24
// init functions in this package, in file-name order.
func init() {
	Register(NewPaymentDefaultReport())
}
