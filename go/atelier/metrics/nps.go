// Package metrics carries the 16 metrics. Each embeds support.BaseMetric,
// declares only Compute, and registers itself in an init function.
package metrics

import (
	"atelier.example/lane/atelier/contracts"
	"atelier.example/lane/atelier/dataset"
	"atelier.example/lane/atelier/support"
)

// Compile-time proof of satisfaction; nothing else names the contract here.
var _ contracts.MetricContract = (*NpsMetric)(nil)

// NpsMetric computes the nps metric.
type NpsMetric struct {
	support.BaseMetric
}

// NewNpsMetric builds the metric with its key and unit.
func NewNpsMetric() *NpsMetric {
	return &NpsMetric{BaseMetric: support.NewBaseMetric("nps", contracts.UnitCount)}
}

// Compute is the only contract method this type declares; Key and Unit are
// promoted from the embedded base.
func (m *NpsMetric) Compute(data *dataset.Dataset) float64 {
	return float64(len(data.Customers)) * 8.5
}

// init registers this metric.
func init() {
	Register(NewNpsMetric())
}
