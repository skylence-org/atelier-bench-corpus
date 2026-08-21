// Package metrics carries the 16 metrics. Each embeds support.BaseMetric,
// declares only Compute, and registers itself in an init function.
package metrics

import (
	"atelier.example/lane/atelier/contracts"
	"atelier.example/lane/atelier/dataset"
	"atelier.example/lane/atelier/support"
)

// Compile-time proof of satisfaction; nothing else names the contract here.
var _ contracts.MetricContract = (*UpsellRateMetric)(nil)

// UpsellRateMetric computes the upsell-rate metric.
type UpsellRateMetric struct {
	support.BaseMetric
}

// NewUpsellRateMetric builds the metric with its key and unit.
func NewUpsellRateMetric() *UpsellRateMetric {
	return &UpsellRateMetric{BaseMetric: support.NewBaseMetric("upsell-rate", contracts.UnitPercent)}
}

// Compute is the only contract method this type declares; Key and Unit are
// promoted from the embedded base.
func (m *UpsellRateMetric) Compute(data *dataset.Dataset) float64 {
	upsold := 0
	for _, order := range data.Orders {
		if len(order.Parts) > 1 {
			upsold++
		}
	}
	return float64(upsold) / float64(max(len(data.Orders), 1))
}

// init registers this metric.
func init() {
	Register(NewUpsellRateMetric())
}
