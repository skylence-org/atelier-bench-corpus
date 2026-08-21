// Package metrics carries the 16 metrics. Each embeds support.BaseMetric,
// declares only Compute, and registers itself in an init function.
package metrics

import (
	"atelier.example/lane/atelier/contracts"
	"atelier.example/lane/atelier/dataset"
	"atelier.example/lane/atelier/support"
)

// Compile-time proof of satisfaction; nothing else names the contract here.
var _ contracts.MetricContract = (*PartCostMetric)(nil)

// PartCostMetric computes the part-cost metric.
type PartCostMetric struct {
	support.BaseMetric
}

// NewPartCostMetric builds the metric with its key and unit.
func NewPartCostMetric() *PartCostMetric {
	return &PartCostMetric{BaseMetric: support.NewBaseMetric("part-cost", contracts.UnitCents)}
}

// Compute is the only contract method this type declares; Key and Unit are
// promoted from the embedded base.
func (m *PartCostMetric) Compute(data *dataset.Dataset) float64 {
	return float64(data.PartsCostCents())
}

// init registers this metric.
func init() {
	Register(NewPartCostMetric())
}
