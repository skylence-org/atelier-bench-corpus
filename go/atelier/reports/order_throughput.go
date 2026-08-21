// Package reports carries the 24 concrete reports. Each one embeds a base
// from atelier/support, declares only Rows, and registers itself in an init()
// function; Slug, Title, CacheKey and TTLSeconds arrive by promotion.
package reports

import (
	"atelier.example/lane/atelier/contracts"
	"atelier.example/lane/atelier/dataset"
	"atelier.example/lane/atelier/support"
)

// Compile-time proof of satisfaction: this assertion is the ONLY textual
// link between the struct and the interface it satisfies.
var _ contracts.ReportContract = (*OrderThroughputReport)(nil)

// OrderThroughputReport reports order throughput.
type OrderThroughputReport struct {
	support.BaseReport
}

// NewOrderThroughputReport builds the report with its slug and title.
func NewOrderThroughputReport() *OrderThroughputReport {
	return &OrderThroughputReport{BaseReport: support.NewBaseReport("order-throughput", "Order throughput")}
}

// Rows is the only contract method this type declares.
func (r *OrderThroughputReport) Rows(data *dataset.Dataset) []contracts.ReportRow {
	return []contracts.ReportRow{
		contracts.Row("completed", float64(len(data.CompletedOrders()))),
		contracts.Row("open", float64(len(data.OpenOrders()))),
	}
}

// init registers this report; the package-level registry is built by the 24
// init functions in this package, in file-name order.
func init() {
	Register(NewOrderThroughputReport())
}
