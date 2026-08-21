package app

import (
	"fmt"

	"atelier.example/lane/atelier/metrics"
	"atelier.example/lane/atelier/rules"
)

// Summarize is the seed line every lane prints.
func Summarize(state *State) string {
	data := state.Data
	return fmt.Sprintf(
		"seeded: %d customer(s), %d order(s), %d part(s), revenue %dc",
		len(data.Customers),
		len(data.Orders),
		len(data.Parts),
		data.RevenueCents(),
	)
}

// MetricLines renders every registered metric, in sorted key order.
func MetricLines(state *State) []string {
	lines := make([]string, 0, metrics.Count())
	for _, metric := range metrics.All() {
		lines = append(lines, fmt.Sprintf("%s = %.2f %s", metric.Key(), metric.Compute(state.Data), metric.Unit()))
	}
	return lines
}

// RuleLine renders the satisfied-rule tally.
func RuleLine(state *State) string {
	return fmt.Sprintf("rules: %d/%d satisfied", len(rules.Satisfied(state.Data)), rules.Count())
}
