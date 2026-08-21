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
var _ contracts.ReportContract = (*CustomerRetentionReport)(nil)

// CustomerRetentionReport reports customer retention.
type CustomerRetentionReport struct {
	support.BaseReport
}

// NewCustomerRetentionReport builds the report with its slug and title.
func NewCustomerRetentionReport() *CustomerRetentionReport {
	return &CustomerRetentionReport{BaseReport: support.NewBaseReport("customer-retention", "Customer retention")}
}

// Rows is the only contract method this type declares.
func (r *CustomerRetentionReport) Rows(data *dataset.Dataset) []contracts.ReportRow {
	rows := make([]contracts.ReportRow, 0, len(data.Customers))
	for _, customer := range data.Customers {
		count := float64(len(data.OrdersOf(customer.ID)))
		if count > 1 {
			rows = append(rows, contracts.Row(customer.Name, count))
		}
	}
	return rows
}

// init registers this report; the package-level registry is built by the 24
// init functions in this package, in file-name order.
func init() {
	Register(NewCustomerRetentionReport())
}
