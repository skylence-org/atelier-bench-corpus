// Package metrics carries the 16 metrics. Each embeds support.BaseMetric,
// declares only Compute, and registers itself in an init function.
package metrics

import (
	"atelier.example/lane/atelier/contracts"
	"atelier.example/lane/atelier/dataset"
	"atelier.example/lane/atelier/support"
)

// Compile-time proof of satisfaction; nothing else names the contract here.
var _ contracts.MetricContract = (*LaborCostMetric)(nil)

// LaborCostMetric computes the labor-cost metric.
type LaborCostMetric struct {
	support.BaseMetric
}

// NewLaborCostMetric builds the metric with its key and unit.
func NewLaborCostMetric() *LaborCostMetric {
	return &LaborCostMetric{BaseMetric: support.NewBaseMetric("labor-cost", contracts.UnitCents)}
}

// Compute is the only contract method this type declares; Key and Unit are
// promoted from the embedded base.
func (m *LaborCostMetric) Compute(data *dataset.Dataset) float64 {
	return float64(data.LabourMinutes() * 125)
}

// init registers this metric.
func init() {
	Register(NewLaborCostMetric())
}
