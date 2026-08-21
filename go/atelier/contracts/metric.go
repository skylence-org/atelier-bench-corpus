package contracts

import "atelier.example/lane/atelier/dataset"

// MetricUnit is the third iota enum in the lane.
type MetricUnit int

// The four units.
const (
	UnitCount MetricUnit = iota
	UnitCents
	UnitPercent
	UnitDays
)

var metricUnitNames = map[MetricUnit]string{
	UnitCount:   "count",
	UnitCents:   "cents",
	UnitPercent: "percent",
	UnitDays:    "days",
}

// String is the wire value of a unit.
func (u MetricUnit) String() string {
	return metricUnitNames[u]
}

// MetricContract is what all 16 metrics satisfy.
type MetricContract interface {
	Key() string
	Unit() MetricUnit
	Compute(data *dataset.Dataset) float64
}
