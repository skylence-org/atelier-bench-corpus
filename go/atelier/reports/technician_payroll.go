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
var _ contracts.ReportContract = (*TechnicianPayrollReport)(nil)

// TechnicianPayrollReport reports technician payroll.
type TechnicianPayrollReport struct {
	support.BaseReport
}

// NewTechnicianPayrollReport builds the report with its slug and title.
func NewTechnicianPayrollReport() *TechnicianPayrollReport {
	return &TechnicianPayrollReport{BaseReport: support.NewBaseReport("technician-payroll", "Technician payroll")}
}

// Rows is the only contract method this type declares.
func (r *TechnicianPayrollReport) Rows(data *dataset.Dataset) []contracts.ReportRow {
	headcount := len(data.Technicians)
	if headcount == 0 {
		headcount = 1
	}
	share := int64(data.LabourMinutes()/headcount) * 125
	rows := make([]contracts.ReportRow, 0, len(data.Technicians))
	for _, technician := range data.Technicians {
		rows = append(rows, contracts.RowFromCents(technician.Name, share))
	}
	return rows
}

// init registers this report; the package-level registry is built by the 24
// init functions in this package, in file-name order.
func init() {
	Register(NewTechnicianPayrollReport())
}
