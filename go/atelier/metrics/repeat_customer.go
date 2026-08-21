// Package metrics carries the 16 metrics. Each embeds support.BaseMetric,
// declares only Compute, and registers itself in an init function.
package metrics

import (
	"atelier.example/lane/atelier/contracts"
	"atelier.example/lane/atelier/dataset"
	"atelier.example/lane/atelier/support"
)

// Compile-time proof of satisfaction; nothing else names the contract here.
var _ contracts.MetricContract = (*RepeatCustomerMetric)(nil)

// RepeatCustomerMetric computes the repeat-customer metric.
type RepeatCustomerMetric struct {
	support.BaseMetric
}

// NewRepeatCustomerMetric builds the metric with its key and unit.
func NewRepeatCustomerMetric() *RepeatCustomerMetric {
	return &RepeatCustomerMetric{BaseMetric: support.NewBaseMetric("repeat-customer", contracts.UnitPercent)}
}

// Compute is the only contract method this type declares; Key and Unit are
// promoted from the embedded base.
func (m *RepeatCustomerMetric) Compute(data *dataset.Dataset) float64 {
	if len(data.Customers) == 0 {
		return 0
	}
	repeat := 0
	for _, customer := range data.Customers {
		if len(data.OrdersOf(customer.ID)) > 1 {
			repeat++
		}
	}
	return float64(repeat) / float64(len(data.Customers))
}

// init registers this metric.
func init() {
	Register(NewRepeatCustomerMetric())
}
