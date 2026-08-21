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
var _ contracts.ReportContract = (*PartShortageReport)(nil)

// PartShortageReport reports part shortage.
type PartShortageReport struct {
	support.BaseReport
}

// NewPartShortageReport builds the report with its slug and title.
func NewPartShortageReport() *PartShortageReport {
	return &PartShortageReport{BaseReport: support.NewBaseReport("part-shortage", "Part shortage")}
}

// Rows is the only contract method this type declares.
func (r *PartShortageReport) Rows(data *dataset.Dataset) []contracts.ReportRow {
	low := data.LowStockParts()
	rows := make([]contracts.ReportRow, 0, len(low))
	for _, part := range low {
		rows = append(rows, contracts.Row(part.SKU, float64(part.Stock)))
	}
	return rows
}

// init registers this report; the package-level registry is built by the 24
// init functions in this package, in file-name order.
func init() {
	Register(NewPartShortageReport())
}
