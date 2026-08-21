package rules

import (
	"atelier.example/lane/atelier/contracts"
	"atelier.example/lane/atelier/dataset"
	"atelier.example/lane/atelier/rules/adhoc"
	"atelier.example/lane/atelier/support"
)

// registry holds all 48 rules: the 24 nominal structs register themselves in
// their own init functions, and the 24 structural values are folded in here.
var registry = support.NewRegistry[contracts.RuleContract]()

// Register adds one rule under its key. Both rule families go through it.
func Register(rule contracts.RuleContract) {
	registry.Add(rule.Key(), rule)
}

// init folds in the structural rules. Package-level variables are initialised
// before any init function runs, so `registry` is never nil here.
func init() {
	for _, rule := range adhoc.Rules {
		Register(rule)
	}
}

// All returns every rule, sorted by key.
func All() []contracts.RuleContract {
	return registry.All()
}

// ByKey resolves one rule.
func ByKey(key string) (contracts.RuleContract, bool) {
	return registry.Get(key)
}

// Keys lists every rule key, sorted.
func Keys() []string {
	return registry.Keys()
}

// Count is how many rules registered: 24 nominal plus 24 structural.
func Count() int {
	return registry.Len()
}

// Satisfied lists the keys of the rules that hold on this dataset.
func Satisfied(data *dataset.Dataset) []string {
	satisfied := make([]string, 0, registry.Len())
	for _, rule := range All() {
		if rule.Evaluate(data) {
			satisfied = append(satisfied, rule.Key())
		}
	}
	return satisfied
}
