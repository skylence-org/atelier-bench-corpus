// Package metrics carries the 16 metrics. Each embeds support.BaseMetric,
// declares only Compute, and registers itself in an init function.
package metrics

import (
	"atelier.example/lane/atelier/contracts"
	"atelier.example/lane/atelier/dataset"
	"atelier.example/lane/atelier/support"
)

// Compile-time proof of satisfaction; nothing else names the contract here.
var _ contracts.MetricContract = (*PartsPerOrderMetric)(nil)

// PartsPerOrderMetric computes the parts-per-order metric.
type PartsPerOrderMetric struct {
	support.BaseMetric
}

// NewPartsPerOrderMetric builds the metric with its key and unit.
func NewPartsPerOrderMetric() *PartsPerOrderMetric {
	return &PartsPerOrderMetric{BaseMetric: support.NewBaseMetric("parts-per-order", contracts.UnitCount)}
}

// Compute is the only contract method this type declares; Key and Unit are
// promoted from the embedded base.
func (m *PartsPerOrderMetric) Compute(data *dataset.Dataset) float64 {
	lines := 0
	for _, order := range data.Orders {
		lines += len(order.Parts)
	}
	return float64(lines) / float64(max(len(data.Orders), 1))
}

// init registers this metric.
func init() {
	Register(NewPartsPerOrderMetric())
}
