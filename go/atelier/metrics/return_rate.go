// Package metrics carries the 16 metrics. Each embeds support.BaseMetric,
// declares only Compute, and registers itself in an init function.
package metrics

import (
	"atelier.example/lane/atelier/contracts"
	"atelier.example/lane/atelier/dataset"
	"atelier.example/lane/atelier/support"
)

// Compile-time proof of satisfaction; nothing else names the contract here.
var _ contracts.MetricContract = (*ReturnRateMetric)(nil)

// ReturnRateMetric computes the return-rate metric.
type ReturnRateMetric struct {
	support.BaseMetric
}

// NewReturnRateMetric builds the metric with its key and unit.
func NewReturnRateMetric() *ReturnRateMetric {
	return &ReturnRateMetric{BaseMetric: support.NewBaseMetric("return-rate", contracts.UnitPercent)}
}

// Compute is the only contract method this type declares; Key and Unit are
// promoted from the embedded base.
func (m *ReturnRateMetric) Compute(data *dataset.Dataset) float64 {
	returned := 0
	for _, order := range data.Orders {
		if len(order.Log) > 3 {
			returned++
		}
	}
	return float64(returned) / float64(max(len(data.Orders), 1))
}

// init registers this metric.
func init() {
	Register(NewReturnRateMetric())
}
