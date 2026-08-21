// Package metrics carries the 16 metrics. Each embeds support.BaseMetric,
// declares only Compute, and registers itself in an init function.
package metrics

import (
	"atelier.example/lane/atelier/contracts"
	"atelier.example/lane/atelier/dataset"
	"atelier.example/lane/atelier/support"
)

// Compile-time proof of satisfaction; nothing else names the contract here.
var _ contracts.MetricContract = (*TechnicianUtilizationMetric)(nil)

// TechnicianUtilizationMetric computes the technician-utilization metric.
type TechnicianUtilizationMetric struct {
	support.BaseMetric
}

// NewTechnicianUtilizationMetric builds the metric with its key and unit.
func NewTechnicianUtilizationMetric() *TechnicianUtilizationMetric {
	return &TechnicianUtilizationMetric{BaseMetric: support.NewBaseMetric("technician-utilization", contracts.UnitPercent)}
}

// Compute is the only contract method this type declares; Key and Unit are
// promoted from the embedded base.
func (m *TechnicianUtilizationMetric) Compute(data *dataset.Dataset) float64 {
	if len(data.Technicians) == 0 {
		return 0
	}
	total := 0.0
	for _, technician := range data.Technicians {
		total += technician.Utilisation()
	}
	return total / float64(len(data.Technicians))
}

// init registers this metric.
func init() {
	Register(NewTechnicianUtilizationMetric())
}
