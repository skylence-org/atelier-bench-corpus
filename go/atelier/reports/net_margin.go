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
var _ contracts.ReportContract = (*NetMarginReport)(nil)

// NetMarginReport reports net margin.
type NetMarginReport struct {
	support.BaseReport
}

// NewNetMarginReport builds the report with its slug and title.
func NewNetMarginReport() *NetMarginReport {
	return &NetMarginReport{BaseReport: support.NewBaseReport("net-margin", "Net margin")}
}

// Rows is the only contract method this type declares.
func (r *NetMarginReport) Rows(data *dataset.Dataset) []contracts.ReportRow {
	revenue := data.RevenueCents()
	margin := 0.0
	if revenue != 0 {
		margin = float64(revenue-data.PartsCostCents()) / float64(revenue)
	}
	return []contracts.ReportRow{contracts.Row("net margin", margin)}
}

// init registers this report; the package-level registry is built by the 24
// init functions in this package, in file-name order.
func init() {
	Register(NewNetMarginReport())
}
