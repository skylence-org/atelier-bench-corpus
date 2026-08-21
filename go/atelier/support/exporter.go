package support

import "atelier.example/lane/atelier/concerns"

// BaseExporter is the exporter-side base: extension plus promoted formatting.
type BaseExporter struct {
	concerns.HasFormatting
	extension string
}

// NewBaseExporter seeds the base.
func NewBaseExporter(extension string) BaseExporter {
	return BaseExporter{extension: extension}
}

// Extension is promoted onto all 8 exporters.
func (e BaseExporter) Extension() string {
	return e.extension
}
