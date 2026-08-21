// Package commands carries the console commands.
package commands

import (
	"fmt"

	"atelier.example/lane/app"
	"atelier.example/lane/atelier/exporters"
	"atelier.example/lane/atelier/reports"
	"atelier.example/yamlish.v2"
)

// ExportReport renders one report through the exporter registered under the
// given extension. Both lookups are STRING-KEYED: neither the report type nor
// the exporter type is named here.
func ExportReport(state *app.State, slug string, extension string) (string, error) {
	report, found := reports.BySlug(slug)
	if !found {
		return "", fmt.Errorf("unknown report %q", slug)
	}
	exporter, found := exporters.ByExtension(extension)
	if !found {
		return "", fmt.Errorf("unknown format %q", extension)
	}
	return exporter.Export(report.Rows(state.Data)), nil
}

// ExportManifest renders the run manifest with the in-tree yamlish module.
// The import path ends in "yamlish.v2" but the package identifier is
// "yamlish", so the call below does not match the path's last segment.
func ExportManifest(state *app.State) string {
	return yamlish.Marshal(map[string]string{
		"calculator": state.Container.InvoiceCalculator().Name(),
		"orders":     fmt.Sprint(len(state.Data.Orders)),
		"reports":    fmt.Sprint(reports.Count()),
		"revenue":    fmt.Sprint(state.Data.RevenueCents()),
		"version":    yamlish.Version,
	})
}
