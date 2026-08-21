// Package exporters carries the 8 exporters. Each embeds support.BaseExporter
// (Extension, FormatCell), declares only Export, and registers itself under
// its extension in an init function.
package exporters

import (
	"fmt"
	"strings"

	"atelier.example/lane/atelier/contracts"
	"atelier.example/lane/atelier/support"
)

// Compile-time proof of satisfaction.
var _ contracts.ExporterContract = (*CsvExporter)(nil)

// CsvExporter renders report rows as csv.
type CsvExporter struct {
	support.BaseExporter
	MimeType string
}

// NewCsvExporter builds the exporter.
func NewCsvExporter() *CsvExporter {
	return &CsvExporter{BaseExporter: support.NewBaseExporter("csv"), MimeType: "text/csv"}
}

// Export is the only contract method this type declares.
func (e *CsvExporter) Export(rows []contracts.ReportRow) string {
	lines := make([]string, 0, len(rows))
	for _, row := range rows {
		lines = append(lines, fmt.Sprintf("%s,%s", row.Label, e.FormatCell(float64(row.Cents))))
	}
	return strings.Join(lines, "\n")
}

// init registers this exporter under its extension.
func init() {
	Register(NewCsvExporter())
}
