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
var _ contracts.ReportContract = (*WeeklyRevenueReport)(nil)

// WeeklyRevenueReport reports weekly revenue.
type WeeklyRevenueReport struct {
	support.PeriodicReport
}

// NewWeeklyRevenueReport builds the report with its slug and title.
func NewWeeklyRevenueReport() *WeeklyRevenueReport {
	return &WeeklyRevenueReport{PeriodicReport: support.NewPeriodicReport("weekly-revenue", "Weekly revenue", contracts.CadenceWeekly)}
}

// Rows is the only contract method this type declares.
func (r *WeeklyRevenueReport) Rows(data *dataset.Dataset) []contracts.ReportRow {
	return []contracts.ReportRow{contracts.RowFromCents("week to date", data.RevenueCents())}
}

// init registers this report; the package-level registry is built by the 24
// init functions in this package, in file-name order.
func init() {
	Register(NewWeeklyRevenueReport())
}
