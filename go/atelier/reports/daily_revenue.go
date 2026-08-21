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
var _ contracts.ReportContract = (*DailyRevenueReport)(nil)

// DailyRevenueReport reports daily revenue.
type DailyRevenueReport struct {
	support.PeriodicReport
}

// NewDailyRevenueReport builds the report with its slug and title.
func NewDailyRevenueReport() *DailyRevenueReport {
	return &DailyRevenueReport{PeriodicReport: support.NewPeriodicReport("daily-revenue", "Daily revenue", contracts.CadenceDaily)}
}

// Rows is the only contract method this type declares.
func (r *DailyRevenueReport) Rows(data *dataset.Dataset) []contracts.ReportRow {
	completed := data.CompletedOrders()
	rows := make([]contracts.ReportRow, 0, len(completed))
	for _, order := range completed {
		rows = append(rows, contracts.RowFromCents(fmt.Sprintf("order-%d", order.ID), order.PartsSubtotal().Cents()))
	}
	return rows
}

// init registers this report; the package-level registry is built by the 24
// init functions in this package, in file-name order.
func init() {
	Register(NewDailyRevenueReport())
}
