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
var _ contracts.ReportContract = (*InventoryTurnoverReport)(nil)

// InventoryTurnoverReport reports inventory turnover.
type InventoryTurnoverReport struct {
	support.BaseReport
}

// NewInventoryTurnoverReport builds the report with its slug and title.
func NewInventoryTurnoverReport() *InventoryTurnoverReport {
	return &InventoryTurnoverReport{BaseReport: support.NewBaseReport("inventory-turnover", "Inventory turnover")}
}

// Rows is the only contract method this type declares.
func (r *InventoryTurnoverReport) Rows(data *dataset.Dataset) []contracts.ReportRow {
	rows := make([]contracts.ReportRow, 0, len(data.Parts))
	for _, part := range data.Parts {
		turnover := 0.0
		if part.Stock != 0 {
			turnover = float64(part.ConsumedQuantity()) / float64(part.Stock)
		}
		rows = append(rows, contracts.Row(part.SKU, turnover))
	}
	return rows
}

// init registers this report; the package-level registry is built by the 24
// init functions in this package, in file-name order.
func init() {
	Register(NewInventoryTurnoverReport())
}
