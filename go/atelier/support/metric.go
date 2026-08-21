package support

import (
	"fmt"

	"atelier.example/lane/atelier/concerns"
	"atelier.example/lane/atelier/contracts"
	"atelier.example/lane/atelier/dataset"
)

// BaseMetric is the metric-side base: key, unit and a promoted logger.
type BaseMetric struct {
	concerns.HasLogging
	key  string
	unit contracts.MetricUnit
}

// NewBaseMetric seeds the base.
func NewBaseMetric(key string, unit contracts.MetricUnit) BaseMetric {
	return BaseMetric{key: key, unit: unit}
}

// Key is promoted onto all 16 metrics.
func (m BaseMetric) Key() string {
	return m.key
}

// Unit is promoted alongside Key.
func (m BaseMetric) Unit() contracts.MetricUnit {
	return m.unit
}

// Formatted renders a computed metric with its unit.
func Formatted(metric contracts.MetricContract, data *dataset.Dataset) string {
	return fmt.Sprintf("%.2f %s", metric.Compute(data), metric.Unit())
}
