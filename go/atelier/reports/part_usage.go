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
var _ contracts.ReportContract = (*PartUsageReport)(nil)

// PartUsageReport reports part usage.
type PartUsageReport struct {
	support.BaseReport
}

// NewPartUsageReport builds the report with its slug and title.
func NewPartUsageReport() *PartUsageReport {
	return &PartUsageReport{BaseReport: support.NewBaseReport("part-usage", "Part usage")}
}

// Rows is the only contract method this type declares.
func (r *PartUsageReport) Rows(data *dataset.Dataset) []contracts.ReportRow {
	rows := make([]contracts.ReportRow, 0, len(data.Parts))
	for _, part := range data.Parts {
		rows = append(rows, contracts.Row(part.Name, float64(part.ConsumedQuantity())))
	}
	return rows
}

// init registers this report; the package-level registry is built by the 24
// init functions in this package, in file-name order.
func init() {
	Register(NewPartUsageReport())
}
