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
var _ contracts.ExporterContract = (*MarkdownExporter)(nil)

// MarkdownExporter renders report rows as md.
type MarkdownExporter struct {
	support.BaseExporter
	MimeType string
}

// NewMarkdownExporter builds the exporter.
func NewMarkdownExporter() *MarkdownExporter {
	return &MarkdownExporter{BaseExporter: support.NewBaseExporter("md"), MimeType: "text/markdown"}
}

// Export is the only contract method this type declares.
func (e *MarkdownExporter) Export(rows []contracts.ReportRow) string {
	lines := []string{"| label | amount |", "| --- | --- |"}
	for _, row := range rows {
		lines = append(lines, fmt.Sprintf("| %s | %s |", row.Label, e.FormatCell(float64(row.Cents))))
	}
	return strings.Join(lines, "\n")
}

// init registers this exporter under its extension.
func init() {
	Register(NewMarkdownExporter())
}
