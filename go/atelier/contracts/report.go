// Package contracts holds the bench-side interfaces. Note the name: there is
// a SECOND contracts package at core/contracts with a different member set,
// and files that need both alias one of them at the import site.
package contracts

import (
	"fmt"

	"atelier.example/lane/atelier/dataset"
)

// ReportRow is one output row. Cents keeps the exact amount; Value is the
// float the metrics average over.
type ReportRow struct {
	Label string
	Value float64
	Cents int64
}

// Row builds a row from a float value.
func Row(label string, value float64) ReportRow {
	return ReportRow{Label: label, Value: value}
}

// RowFromCents builds a row from an exact cent amount; Value follows it.
func RowFromCents(label string, cents int64) ReportRow {
	return ReportRow{Label: label, Value: float64(cents), Cents: cents}
}

// String renders "label=12.00".
func (r ReportRow) String() string {
	return fmt.Sprintf("%s=%.2f", r.Label, r.Value)
}

// ReportContract is the contract all 24 reports satisfy. Nothing declares the
// relationship: each report file carries a compile-time assertion instead.
type ReportContract interface {
	Slug() string
	Title() string
	Rows(data *dataset.Dataset) []ReportRow
}
