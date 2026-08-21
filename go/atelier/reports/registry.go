package reports

import (
	"atelier.example/lane/atelier/contracts"
	"atelier.example/lane/atelier/support"
)

// registry is filled by the init function in each of the 24 report files. Go
// runs them in file-name order within a package, and every package the binary
// imports is initialised before main.
var registry = support.NewRegistry[contracts.ReportContract]()

// Register adds one report under its slug.
func Register(report contracts.ReportContract) {
	registry.Add(report.Slug(), report)
}

// All returns every registered report, sorted by slug.
func All() []contracts.ReportContract {
	return registry.All()
}

// BySlug resolves one report by its slug.
func BySlug(slug string) (contracts.ReportContract, bool) {
	return registry.Get(slug)
}

// Slugs lists the registered slugs, sorted.
func Slugs() []string {
	return registry.Keys()
}

// Count is how many reports registered themselves.
func Count() int {
	return registry.Len()
}
