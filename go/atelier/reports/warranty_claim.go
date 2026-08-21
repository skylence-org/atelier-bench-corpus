// Package reports carries the 24 concrete reports. Each one embeds a base
// from atelier/support, declares only Rows, and registers itself in an init()
// function; Slug, Title, CacheKey and TTLSeconds arrive by promotion.
package reports

import (
	"fmt"

	"atelier.example/lane/atelier/contracts"
	"atelier.example/lane/atelier/dataset"
	"atelier.example/lane/atelier/support"
	coresupport "atelier.example/lane/core/support"
)

// Compile-time proof of satisfaction: this assertion is the ONLY textual
// link between the struct and the interface it satisfies.
var _ contracts.ReportContract = (*WarrantyClaimReport)(nil)

// WarrantyClaimReport reports warranty claims.
type WarrantyClaimReport struct {
	support.BaseReport
}

// NewWarrantyClaimReport builds the report with its slug and title.
func NewWarrantyClaimReport() *WarrantyClaimReport {
	return &WarrantyClaimReport{BaseReport: support.NewBaseReport("warranty-claim", "Warranty claims")}
}

// Rows is the only contract method this type declares.
func (r *WarrantyClaimReport) Rows(data *dataset.Dataset) []contracts.ReportRow {
	rows := make([]contracts.ReportRow, 0, len(data.Orders))
	for _, order := range data.Orders {
		if order.Priority != coresupport.PriorityWarranty {
			continue
		}
		rows = append(rows, contracts.Row(fmt.Sprintf("order-%d", order.ID), 1))
	}
	return rows
}

// init registers this report; the package-level registry is built by the 24
// init functions in this package, in file-name order.
func init() {
	Register(NewWarrantyClaimReport())
}
