// Package metrics carries the 16 metrics. Each embeds support.BaseMetric,
// declares only Compute, and registers itself in an init function.
package metrics

import (
	"atelier.example/lane/atelier/contracts"
	"atelier.example/lane/atelier/dataset"
	"atelier.example/lane/atelier/support"
)

// Compile-time proof of satisfaction; nothing else names the contract here.
var _ contracts.MetricContract = (*MarginMetric)(nil)

// MarginMetric computes the margin metric.
type MarginMetric struct {
	support.BaseMetric
}

// NewMarginMetric builds the metric with its key and unit.
func NewMarginMetric() *MarginMetric {
	return &MarginMetric{BaseMetric: support.NewBaseMetric("margin", contracts.UnitPercent)}
}

// Compute is the only contract method this type declares; Key and Unit are
// promoted from the embedded base.
func (m *MarginMetric) Compute(data *dataset.Dataset) float64 {
	revenue := data.RevenueCents()
	if revenue == 0 {
		return 0
	}
	return float64(revenue-data.PartsCostCents()) / float64(revenue)
}

// init registers this metric.
func init() {
	Register(NewMarginMetric())
}
