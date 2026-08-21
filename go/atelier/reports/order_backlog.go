// Package reports carries the 24 concrete reports. Each one embeds a base
// from atelier/support, declares only Rows, and registers itself in an init()
// function; Slug, Title, CacheKey and TTLSeconds arrive by promotion.
package reports

import (
	"sort"

	"atelier.example/lane/atelier/contracts"
	"atelier.example/lane/atelier/dataset"
	"atelier.example/lane/atelier/support"
)

// Compile-time proof of satisfaction: this assertion is the ONLY textual
// link between the struct and the interface it satisfies.
var _ contracts.ReportContract = (*OrderBacklogReport)(nil)

// OrderBacklogReport reports order backlog.
type OrderBacklogReport struct {
	support.BaseReport
}

// NewOrderBacklogReport builds the report with its slug and title.
func NewOrderBacklogReport() *OrderBacklogReport {
	return &OrderBacklogReport{BaseReport: support.NewBaseReport("order-backlog", "Order backlog")}
}

// Rows is the only contract method this type declares.
func (r *OrderBacklogReport) Rows(data *dataset.Dataset) []contracts.ReportRow {
	counts := map[string]int{}
	for _, order := range data.OpenOrders() {
		counts[order.Status.Label()]++
	}
	labels := make([]string, 0, len(counts))
	for label := range counts {
		labels = append(labels, label)
	}
	sort.Strings(labels)
	rows := make([]contracts.ReportRow, 0, len(labels))
	for _, label := range labels {
		rows = append(rows, contracts.Row(label, float64(counts[label])))
	}
	return rows
}

// init registers this report; the package-level registry is built by the 24
// init functions in this package, in file-name order.
func init() {
	Register(NewOrderBacklogReport())
}
