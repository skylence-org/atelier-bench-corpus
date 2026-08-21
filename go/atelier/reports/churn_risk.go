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
var _ contracts.ReportContract = (*ChurnRiskReport)(nil)

// ChurnRiskReport reports churn risk.
type ChurnRiskReport struct {
	support.BaseReport
}

// NewChurnRiskReport builds the report with its slug and title.
func NewChurnRiskReport() *ChurnRiskReport {
	return &ChurnRiskReport{BaseReport: support.NewBaseReport("churn-risk", "Churn risk")}
}

// Rows is the only contract method this type declares.
func (r *ChurnRiskReport) Rows(data *dataset.Dataset) []contracts.ReportRow {
	rows := make([]contracts.ReportRow, 0, len(data.Customers))
	for _, customer := range data.Customers {
		stillOpen := false
		for _, order := range data.OrdersOf(customer.ID) {
			if order.IsOpen() {
				stillOpen = true
			}
		}
		if !stillOpen {
			rows = append(rows, contracts.Row(customer.Name, 1))
		}
	}
	return rows
}

// init registers this report; the package-level registry is built by the 24
// init functions in this package, in file-name order.
func init() {
	Register(NewChurnRiskReport())
}
