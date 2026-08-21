package tests

import (
	"testing"

	"atelier.example/lane/atelier/exporters"
	"atelier.example/lane/atelier/metrics"
	"atelier.example/lane/atelier/notifiers"
	"atelier.example/lane/atelier/reports"
	"atelier.example/lane/atelier/rules"
	"atelier.example/lane/atelier/rules/adhoc"
)

func TestBreadthCounts(t *testing.T) {
	cases := []struct {
		name string
		got  int
		want int
	}{
		{"reports", reports.Count(), 24},
		{"metrics", metrics.Count(), 16},
		{"exporters", exporters.Count(), 8},
		{"notifiers", notifiers.Count(), 8},
		{"rules", rules.Count(), 48},
		{"structural rules", len(adhoc.Rules), 24},
	}
	for _, test := range cases {
		if test.got != test.want {
			t.Errorf("%s = %d, want %d", test.name, test.got, test.want)
		}
	}
}

func TestRegistriesAreSorted(t *testing.T) {
	slugs := reports.Slugs()
	if len(slugs) != 24 || slugs[0] != "cash-flow" || slugs[23] != "weekly-revenue" {
		t.Errorf("report slugs = %v", slugs)
	}
	keys := metrics.Keys()
	if keys[0] != "average-ticket" || keys[15] != "warranty-rate" {
		t.Errorf("metric keys = %v", keys)
	}
	if extensions := exporters.Extensions(); extensions[0] != "csv" || extensions[7] != "yaml" {
		t.Errorf("exporter extensions = %v", extensions)
	}
}

func TestEveryRuleHoldsOnTheSeed(t *testing.T) {
	if satisfied := len(rules.Satisfied(seeded())); satisfied != 48 {
		t.Errorf("satisfied rules = %d, want 48", satisfied)
	}
}
