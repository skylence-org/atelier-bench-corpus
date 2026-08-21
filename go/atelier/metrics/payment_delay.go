// Package metrics carries the 16 metrics. Each embeds support.BaseMetric,
// declares only Compute, and registers itself in an init function.
package metrics

import (
	"atelier.example/lane/atelier/contracts"
	"atelier.example/lane/atelier/dataset"
	"atelier.example/lane/atelier/support"
)

// Compile-time proof of satisfaction; nothing else names the contract here.
var _ contracts.MetricContract = (*PaymentDelayMetric)(nil)

// PaymentDelayMetric computes the payment-delay metric.
type PaymentDelayMetric struct {
	support.BaseMetric
}

// NewPaymentDelayMetric builds the metric with its key and unit.
func NewPaymentDelayMetric() *PaymentDelayMetric {
	return &PaymentDelayMetric{BaseMetric: support.NewBaseMetric("payment-delay", contracts.UnitDays)}
}

// Compute is the only contract method this type declares; Key and Unit are
// promoted from the embedded base.
func (m *PaymentDelayMetric) Compute(data *dataset.Dataset) float64 {
	unpaid := 0
	for _, invoice := range data.Invoices {
		if !invoice.Paid {
			unpaid++
		}
	}
	return float64(unpaid) * 3.5
}

// init registers this metric.
func init() {
	Register(NewPaymentDelayMetric())
}
