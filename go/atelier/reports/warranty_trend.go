// Package reports carries the 24 concrete reports. Each one embeds a base
// from atelier/support, declares only Rows, and registers itself in an init()
// function; Slug, Title, CacheKey and TTLSeconds arrive by promotion.
package reports

import (
	"atelier.example/lane/atelier/contracts"
	"atelier.example/lane/atelier/dataset"
	"atelier.example/lane/atelier/support"
	coresupport "atelier.example/lane/core/support"
)

// Compile-time proof of satisfaction: this assertion is the ONLY textual
// link between the struct and the interface it satisfies.
var _ contracts.ReportContract = (*WarrantyTrendReport)(nil)

// WarrantyTrendReport reports warranty trend.
type WarrantyTrendReport struct {
	support.BaseReport
}

// NewWarrantyTrendReport builds the report with its slug and title.
func NewWarrantyTrendReport() *WarrantyTrendReport {
	return &WarrantyTrendReport{BaseReport: support.NewBaseReport("warranty-trend", "Warranty trend")}
}

// Rows is the only contract method this type declares.
func (r *WarrantyTrendReport) Rows(data *dataset.Dataset) []contracts.ReportRow {
	warranty := 0
	for _, order := range data.Orders {
		if order.Priority == coresupport.PriorityWarranty {
			warranty++
		}
	}
	share := 0.0
	if len(data.Orders) != 0 {
		share = float64(warranty) / float64(len(data.Orders))
	}
	return []contracts.ReportRow{contracts.Row("warranty share", share)}
}

// init registers this report; the package-level registry is built by the 24
// init functions in this package, in file-name order.
func init() {
	Register(NewWarrantyTrendReport())
}
