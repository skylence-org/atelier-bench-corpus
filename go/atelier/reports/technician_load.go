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
var _ contracts.ReportContract = (*TechnicianLoadReport)(nil)

// TechnicianLoadReport reports technician load.
type TechnicianLoadReport struct {
	support.BaseReport
}

// NewTechnicianLoadReport builds the report with its slug and title.
func NewTechnicianLoadReport() *TechnicianLoadReport {
	return &TechnicianLoadReport{BaseReport: support.NewBaseReport("technician-load", "Technician load")}
}

// Rows is the only contract method this type declares.
func (r *TechnicianLoadReport) Rows(data *dataset.Dataset) []contracts.ReportRow {
	rows := make([]contracts.ReportRow, 0, len(data.Technicians))
	for _, technician := range data.Technicians {
		rows = append(rows, contracts.Row(technician.Name, technician.Utilisation()))
	}
	return rows
}

// init registers this report; the package-level registry is built by the 24
// init functions in this package, in file-name order.
func init() {
	Register(NewTechnicianLoadReport())
}
