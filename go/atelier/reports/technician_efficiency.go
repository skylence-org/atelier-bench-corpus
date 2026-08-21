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
var _ contracts.ReportContract = (*TechnicianEfficiencyReport)(nil)

// TechnicianEfficiencyReport reports technician efficiency.
type TechnicianEfficiencyReport struct {
	support.BaseReport
}

// NewTechnicianEfficiencyReport builds the report with its slug and title.
func NewTechnicianEfficiencyReport() *TechnicianEfficiencyReport {
	return &TechnicianEfficiencyReport{BaseReport: support.NewBaseReport("technician-efficiency", "Technician efficiency")}
}

// Rows is the only contract method this type declares.
func (r *TechnicianEfficiencyReport) Rows(data *dataset.Dataset) []contracts.ReportRow {
	rows := make([]contracts.ReportRow, 0, len(data.Technicians))
	for _, technician := range data.Technicians {
		rows = append(rows, contracts.Row(technician.Name, 1-technician.Utilisation()))
	}
	return rows
}

// init registers this report; the package-level registry is built by the 24
// init functions in this package, in file-name order.
func init() {
	Register(NewTechnicianEfficiencyReport())
}
