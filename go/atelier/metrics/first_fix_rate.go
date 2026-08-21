// Package metrics carries the 16 metrics. Each embeds support.BaseMetric,
// declares only Compute, and registers itself in an init function.
package metrics

import (
	"atelier.example/lane/atelier/contracts"
	"atelier.example/lane/atelier/dataset"
	"atelier.example/lane/atelier/support"
)

// Compile-time proof of satisfaction; nothing else names the contract here.
var _ contracts.MetricContract = (*FirstFixRateMetric)(nil)

// FirstFixRateMetric computes the first-fix-rate metric.
type FirstFixRateMetric struct {
	support.BaseMetric
}

// NewFirstFixRateMetric builds the metric with its key and unit.
func NewFirstFixRateMetric() *FirstFixRateMetric {
	return &FirstFixRateMetric{BaseMetric: support.NewBaseMetric("first-fix-rate", contracts.UnitPercent)}
}

// Compute is the only contract method this type declares; Key and Unit are
// promoted from the embedded base.
func (m *FirstFixRateMetric) Compute(data *dataset.Dataset) float64 {
	if len(data.Orders) == 0 {
		return 0
	}
	firstFix := 0
	for _, order := range data.Orders {
		if len(order.Log) <= 3 {
			firstFix++
		}
	}
	return float64(firstFix) / float64(len(data.Orders))
}

// init registers this metric.
func init() {
	Register(NewFirstFixRateMetric())
}
