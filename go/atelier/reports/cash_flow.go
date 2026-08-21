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
var _ contracts.ReportContract = (*CashFlowReport)(nil)
var _ contracts.CompositeContract = (*CashFlowReport)(nil)
var _ contracts.AuditableContract = (*CashFlowReport)(nil)

// CashFlowReport reports cash flow.
type CashFlowReport struct {
	support.CompositeReport
}

// NewCashFlowReport builds the report with its slug and title.
func NewCashFlowReport() *CashFlowReport {
	return &CashFlowReport{CompositeReport: support.NewCompositeReport("cash-flow", "Cash flow", contracts.CadenceDaily)}
}

// Rows is the only contract method this type declares.
func (r *CashFlowReport) Rows(data *dataset.Dataset) []contracts.ReportRow {
	paid := int64(0)
	outstanding := int64(0)
	for _, invoice := range data.Invoices {
		if invoice.Paid {
			paid += invoice.Total.Cents()
		}
		outstanding += invoice.Outstanding().Cents()
	}
	return []contracts.ReportRow{
		contracts.RowFromCents("paid", paid),
		contracts.RowFromCents("outstanding", outstanding),
	}
}

// init registers this report; the package-level registry is built by the 24
// init functions in this package, in file-name order.
func init() {
	Register(NewCashFlowReport())
}
