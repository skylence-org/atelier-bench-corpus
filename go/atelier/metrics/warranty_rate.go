// Package metrics carries the 16 metrics. Each embeds support.BaseMetric,
// declares only Compute, and registers itself in an init function.
package metrics

import (
	"atelier.example/lane/atelier/contracts"
	"atelier.example/lane/atelier/dataset"
	"atelier.example/lane/atelier/support"
	coresupport "atelier.example/lane/core/support"
)

// Compile-time proof of satisfaction; nothing else names the contract here.
var _ contracts.MetricContract = (*WarrantyRateMetric)(nil)

// WarrantyRateMetric computes the warranty-rate metric.
type WarrantyRateMetric struct {
	support.BaseMetric
}

// NewWarrantyRateMetric builds the metric with its key and unit.
func NewWarrantyRateMetric() *WarrantyRateMetric {
	return &WarrantyRateMetric{BaseMetric: support.NewBaseMetric("warranty-rate", contracts.UnitPercent)}
}

// Compute is the only contract method this type declares; Key and Unit are
// promoted from the embedded base.
func (m *WarrantyRateMetric) Compute(data *dataset.Dataset) float64 {
	warranty := 0
	for _, order := range data.Orders {
		if order.Priority == coresupport.PriorityWarranty {
			warranty++
		}
	}
	return float64(warranty) / float64(max(len(data.Orders), 1))
}

// init registers this metric.
func init() {
	Register(NewWarrantyRateMetric())
}
