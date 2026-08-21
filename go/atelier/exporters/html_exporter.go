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
var _ contracts.ExporterContract = (*HtmlExporter)(nil)

// HtmlExporter renders report rows as html.
type HtmlExporter struct {
	support.BaseExporter
	MimeType string
}

// NewHtmlExporter builds the exporter.
func NewHtmlExporter() *HtmlExporter {
	return &HtmlExporter{BaseExporter: support.NewBaseExporter("html"), MimeType: "text/html"}
}

// Export is the only contract method this type declares.
func (e *HtmlExporter) Export(rows []contracts.ReportRow) string {
	var body strings.Builder
	for _, row := range rows {
		body.WriteString(fmt.Sprintf("<tr><td>%s</td><td>%s</td></tr>", row.Label, e.FormatCell(float64(row.Cents))))
	}
	return fmt.Sprintf("<table>%s</table>", body.String())
}

// init registers this exporter under its extension.
func init() {
	Register(NewHtmlExporter())
}
