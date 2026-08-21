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
var _ contracts.ExporterContract = (*XmlExporter)(nil)

// XmlExporter renders report rows as xml.
type XmlExporter struct {
	support.BaseExporter
	MimeType string
}

// NewXmlExporter builds the exporter.
func NewXmlExporter() *XmlExporter {
	return &XmlExporter{BaseExporter: support.NewBaseExporter("xml"), MimeType: "application/xml"}
}

// Export is the only contract method this type declares.
func (e *XmlExporter) Export(rows []contracts.ReportRow) string {
	var body strings.Builder
	for _, row := range rows {
		body.WriteString(fmt.Sprintf("<row label=%q cents=%q/>", row.Label, fmt.Sprint(row.Cents)))
	}
	return fmt.Sprintf("<rows>%s</rows>", body.String())
}

// init registers this exporter under its extension.
func init() {
	Register(NewXmlExporter())
}
