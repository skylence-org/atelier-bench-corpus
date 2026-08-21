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
var _ contracts.ReportContract = (*ProfitMarginReport)(nil)

// ProfitMarginReport reports profit margin.
type ProfitMarginReport struct {
	support.BaseReport
}

// NewProfitMarginReport builds the report with its slug and title.
func NewProfitMarginReport() *ProfitMarginReport {
	return &ProfitMarginReport{BaseReport: support.NewBaseReport("profit-margin", "Profit margin")}
}

// Rows is the only contract method this type declares.
func (r *ProfitMarginReport) Rows(data *dataset.Dataset) []contracts.ReportRow {
	rows := make([]contracts.ReportRow, 0, len(data.Orders))
	for _, order := range data.Orders {
		parts := order.PartsSubtotal().Cents()
		labour := int64(order.LaborMinutes) * 125
		share := 0.0
		if parts+labour != 0 {
			share = float64(labour) / float64(parts+labour)
		}
		rows = append(rows, contracts.Row(fmt.Sprintf("order-%d", order.ID), share))
	}
	return rows
}

// init registers this report; the package-level registry is built by the 24
// init functions in this package, in file-name order.
func init() {
	Register(NewProfitMarginReport())
}
