// Package metrics carries the 16 metrics. Each embeds support.BaseMetric,
// declares only Compute, and registers itself in an init function.
package metrics

import (
	"atelier.example/lane/atelier/contracts"
	"atelier.example/lane/atelier/dataset"
	"atelier.example/lane/atelier/support"
)

// Compile-time proof of satisfaction; nothing else names the contract here.
var _ contracts.MetricContract = (*AverageTicketMetric)(nil)

// AverageTicketMetric computes the average-ticket metric.
type AverageTicketMetric struct {
	support.BaseMetric
}

// NewAverageTicketMetric builds the metric with its key and unit.
func NewAverageTicketMetric() *AverageTicketMetric {
	return &AverageTicketMetric{BaseMetric: support.NewBaseMetric("average-ticket", contracts.UnitCents)}
}

// Compute is the only contract method this type declares; Key and Unit are
// promoted from the embedded base.
func (m *AverageTicketMetric) Compute(data *dataset.Dataset) float64 {
	if len(data.Orders) == 0 {
		return 0
	}
	return float64(data.RevenueCents()) / float64(len(data.Orders))
}

// init registers this metric.
func init() {
	Register(NewAverageTicketMetric())
}
