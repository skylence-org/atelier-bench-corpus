// Package metrics carries the 16 metrics. Each embeds support.BaseMetric,
// declares only Compute, and registers itself in an init function.
package metrics

import (
	"atelier.example/lane/atelier/contracts"
	"atelier.example/lane/atelier/dataset"
	"atelier.example/lane/atelier/support"
)

// Compile-time proof of satisfaction; nothing else names the contract here.
var _ contracts.MetricContract = (*OrdersPerDayMetric)(nil)

// OrdersPerDayMetric computes the orders-per-day metric.
type OrdersPerDayMetric struct {
	support.BaseMetric
}

// NewOrdersPerDayMetric builds the metric with its key and unit.
func NewOrdersPerDayMetric() *OrdersPerDayMetric {
	return &OrdersPerDayMetric{BaseMetric: support.NewBaseMetric("orders-per-day", contracts.UnitCount)}
}

// Compute is the only contract method this type declares; Key and Unit are
// promoted from the embedded base.
func (m *OrdersPerDayMetric) Compute(data *dataset.Dataset) float64 {
	return float64(len(data.Orders)) / 7
}

// init registers this metric.
func init() {
	Register(NewOrdersPerDayMetric())
}
