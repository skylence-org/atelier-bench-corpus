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
var _ contracts.ReportContract = (*CustomerLifetimeReport)(nil)

// CustomerLifetimeReport reports customer lifetime value.
type CustomerLifetimeReport struct {
	support.BaseReport
}

// NewCustomerLifetimeReport builds the report with its slug and title.
func NewCustomerLifetimeReport() *CustomerLifetimeReport {
	return &CustomerLifetimeReport{BaseReport: support.NewBaseReport("customer-lifetime", "Customer lifetime value")}
}

// Rows is the only contract method this type declares.
func (r *CustomerLifetimeReport) Rows(data *dataset.Dataset) []contracts.ReportRow {
	rows := make([]contracts.ReportRow, 0, len(data.Customers))
	for _, customer := range data.Customers {
		total := int64(0)
		for _, order := range data.OrdersOf(customer.ID) {
			total += order.PartsSubtotal().Cents()
		}
		rows = append(rows, contracts.RowFromCents(customer.Name, total))
	}
	return rows
}

// init registers this report; the package-level registry is built by the 24
// init functions in this package, in file-name order.
func init() {
	Register(NewCustomerLifetimeReport())
}
