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
var _ contracts.ExporterContract = (*YamlExporter)(nil)

// YamlExporter renders report rows as yaml.
type YamlExporter struct {
	support.BaseExporter
	MimeType string
}

// NewYamlExporter builds the exporter.
func NewYamlExporter() *YamlExporter {
	return &YamlExporter{BaseExporter: support.NewBaseExporter("yaml"), MimeType: "application/yaml"}
}

// Export is the only contract method this type declares.
func (e *YamlExporter) Export(rows []contracts.ReportRow) string {
	lines := make([]string, 0, len(rows))
	for _, row := range rows {
		lines = append(lines, fmt.Sprintf("- label: %s\n  cents: %d", row.Label, row.Cents))
	}
	return strings.Join(lines, "\n")
}

// init registers this exporter under its extension.
func init() {
	Register(NewYamlExporter())
}
