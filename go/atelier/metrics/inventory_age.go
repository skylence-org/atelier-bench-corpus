// Package metrics carries the 16 metrics. Each embeds support.BaseMetric,
// declares only Compute, and registers itself in an init function.
package metrics

import (
	"atelier.example/lane/atelier/contracts"
	"atelier.example/lane/atelier/dataset"
	"atelier.example/lane/atelier/support"
)

// Compile-time proof of satisfaction; nothing else names the contract here.
var _ contracts.MetricContract = (*InventoryAgeMetric)(nil)

// InventoryAgeMetric computes the inventory-age metric.
type InventoryAgeMetric struct {
	support.BaseMetric
}

// NewInventoryAgeMetric builds the metric with its key and unit.
func NewInventoryAgeMetric() *InventoryAgeMetric {
	return &InventoryAgeMetric{BaseMetric: support.NewBaseMetric("inventory-age", contracts.UnitDays)}
}

// Compute is the only contract method this type declares; Key and Unit are
// promoted from the embedded base.
func (m *InventoryAgeMetric) Compute(data *dataset.Dataset) float64 {
	stock := 0
	for _, part := range data.Parts {
		stock += part.Stock
	}
	return float64(stock) / float64(max(len(data.Parts), 1))
}

// init registers this metric.
func init() {
	Register(NewInventoryAgeMetric())
}
