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
var _ contracts.ReportContract = (*GrossProfitReport)(nil)

// GrossProfitReport reports gross profit.
type GrossProfitReport struct {
	support.BaseReport
}

// NewGrossProfitReport builds the report with its slug and title.
func NewGrossProfitReport() *GrossProfitReport {
	return &GrossProfitReport{BaseReport: support.NewBaseReport("gross-profit", "Gross profit")}
}

// Rows is the only contract method this type declares.
func (r *GrossProfitReport) Rows(data *dataset.Dataset) []contracts.ReportRow {
	revenue := data.RevenueCents()
	cost := data.PartsCostCents()
	return []contracts.ReportRow{
		contracts.RowFromCents("revenue", revenue),
		contracts.RowFromCents("part cost", cost),
		contracts.RowFromCents("gross profit", revenue-cost),
	}
}

// init registers this report; the package-level registry is built by the 24
// init functions in this package, in file-name order.
func init() {
	Register(NewGrossProfitReport())
}
