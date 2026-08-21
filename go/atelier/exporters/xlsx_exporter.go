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
var _ contracts.ExporterContract = (*XlsxExporter)(nil)

// XlsxExporter renders report rows as xlsx.
type XlsxExporter struct {
	support.BaseExporter
	MimeType string
}

// NewXlsxExporter builds the exporter.
func NewXlsxExporter() *XlsxExporter {
	return &XlsxExporter{BaseExporter: support.NewBaseExporter("xlsx"), MimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}
}

// Export is the only contract method this type declares.
func (e *XlsxExporter) Export(rows []contracts.ReportRow) string {
	cells := make([]string, 0, len(rows))
	for index, row := range rows {
		cells = append(cells, fmt.Sprintf("A%d=%s B%d=%d", index+1, row.Label, index+1, row.Cents))
	}
	return strings.Join(cells, ";")
}

// init registers this exporter under its extension.
func init() {
	Register(NewXlsxExporter())
}
