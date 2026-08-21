package contracts

import "atelier.example/lane/atelier/dataset"

// RuleContract is the NOMINAL rule contract: the 24 rule structs each carry a
// compile-time assertion against it.
type RuleContract interface {
	Key() string
	Evaluate(data *dataset.Dataset) bool
}

// RuleLike is the STRUCTURAL twin: the same method set under a different
// name, satisfied by the 24 ad-hoc rule VALUES which assert nothing at all.
type RuleLike interface {
	Key() string
	Evaluate(data *dataset.Dataset) bool
}

// SatisfiedBy counts the rules that hold on a dataset.
func SatisfiedBy(rules []RuleContract, data *dataset.Dataset) int {
	satisfied := 0
	for _, rule := range rules {
		if rule.Evaluate(data) {
			satisfied++
		}
	}
	return satisfied
}
