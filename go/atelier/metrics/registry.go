package metrics

import (
	"atelier.example/lane/atelier/contracts"
	"atelier.example/lane/atelier/support"
)

// registry is filled by the init function in each of the 16 metric files.
var registry = support.NewRegistry[contracts.MetricContract]()

// Register adds one metric under its key.
func Register(metric contracts.MetricContract) {
	registry.Add(metric.Key(), metric)
}

// All returns every registered metric, sorted by key.
func All() []contracts.MetricContract {
	return registry.All()
}

// ByKey resolves one metric by its key.
func ByKey(key string) (contracts.MetricContract, bool) {
	return registry.Get(key)
}

// Keys lists the registered keys, sorted.
func Keys() []string {
	return registry.Keys()
}

// Count is how many metrics registered themselves.
func Count() int {
	return registry.Len()
}
