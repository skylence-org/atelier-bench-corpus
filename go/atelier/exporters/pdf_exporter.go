// Package exporters carries the 8 exporters. Each embeds support.BaseExporter
// (Extension, FormatCell), declares only Export, and registers itself under
// its extension in an init function.
package exporters

import (
	"fmt"

	"atelier.example/lane/atelier/contracts"
	"atelier.example/lane/atelier/support"
)

// Compile-time proof of satisfaction.
var _ contracts.ExporterContract = (*PdfExporter)(nil)

// PdfExporter renders report rows as pdf.
type PdfExporter struct {
	support.BaseExporter
	MimeType string
}

// NewPdfExporter builds the exporter.
func NewPdfExporter() *PdfExporter {
	return &PdfExporter{BaseExporter: support.NewBaseExporter("pdf"), MimeType: "application/pdf"}
}

// Export is the only contract method this type declares.
func (e *PdfExporter) Export(rows []contracts.ReportRow) string {
	return fmt.Sprintf("%%PDF-1.7\n%% %d row(s)\n%%%%EOF", len(rows))
}

// init registers this exporter under its extension.
func init() {
	Register(NewPdfExporter())
}
