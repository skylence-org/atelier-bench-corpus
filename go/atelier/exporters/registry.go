package exporters

import (
	"atelier.example/lane/atelier/contracts"
	"atelier.example/lane/atelier/support"
)

// registry maps an extension STRING to its exporter. Callers reach an
// exporter through that string, never through its type name.
var registry = support.NewRegistry[contracts.ExporterContract]()

// Register adds one exporter under its extension.
func Register(exporter contracts.ExporterContract) {
	registry.Add(exporter.Extension(), exporter)
}

// ByExtension resolves an exporter from a string key.
func ByExtension(extension string) (contracts.ExporterContract, bool) {
	return registry.Get(extension)
}

// Extensions lists the registered extensions, sorted.
func Extensions() []string {
	return registry.Keys()
}

// All returns every exporter, sorted by extension.
func All() []contracts.ExporterContract {
	return registry.All()
}

// Count is how many exporters registered themselves.
func Count() int {
	return registry.Len()
}
