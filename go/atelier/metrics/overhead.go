// Package metrics carries the 16 metrics. Each embeds support.BaseMetric,
// declares only Compute, and registers itself in an init function.
package metrics

import (
	"atelier.example/lane/atelier/contracts"
	"atelier.example/lane/atelier/dataset"
	"atelier.example/lane/atelier/support"
)

// Compile-time proof of satisfaction; nothing else names the contract here.
var _ contracts.MetricContract = (*OverheadMetric)(nil)

// OverheadMetric computes the overhead metric.
type OverheadMetric struct {
	support.BaseMetric
}

// NewOverheadMetric builds the metric with its key and unit.
func NewOverheadMetric() *OverheadMetric {
	return &OverheadMetric{BaseMetric: support.NewBaseMetric("overhead", contracts.UnitCents)}
}

// Compute is the only contract method this type declares; Key and Unit are
// promoted from the embedded base.
func (m *OverheadMetric) Compute(data *dataset.Dataset) float64 {
	return float64(data.PartsCostCents()) * 0.15
}

// init registers this metric.
func init() {
	Register(NewOverheadMetric())
}
