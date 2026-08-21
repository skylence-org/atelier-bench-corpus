// Package exporters carries the 8 exporters. Each embeds support.BaseExporter
// (Extension, FormatCell), declares only Export, and registers itself under
// its extension in an init function.
package exporters

import (
	"encoding/json"

	"atelier.example/lane/atelier/contracts"
	"atelier.example/lane/atelier/support"
)

// Compile-time proof of satisfaction.
var _ contracts.ExporterContract = (*JsonExporter)(nil)

// JsonExporter renders report rows as json.
type JsonExporter struct {
	support.BaseExporter
	MimeType string
}

// NewJsonExporter builds the exporter.
func NewJsonExporter() *JsonExporter {
	return &JsonExporter{BaseExporter: support.NewBaseExporter("json"), MimeType: "application/json"}
}

// Export is the only contract method this type declares.
func (e *JsonExporter) Export(rows []contracts.ReportRow) string {
	encoded, err := json.Marshal(rows)
	if err != nil {
		return "[]"
	}
	return string(encoded)
}

// init registers this exporter under its extension.
func init() {
	Register(NewJsonExporter())
}
