// Package rules carries the 48 rules: 24 NOMINAL rule structs in this package
// (each with a compile-time assertion against RuleContract and a value
// receiver) plus the 24 STRUCTURAL ad-hoc rule values from rules/adhoc, which
// assert nothing and satisfy the same method set by shape alone.
package rules

import (
	"atelier.example/lane/atelier/contracts"
	"atelier.example/lane/atelier/dataset"
	coresupport "atelier.example/lane/core/support"
)

// Compile-time proof against the NOMINAL contract, asserted on the VALUE
// type: PriorityEscalationRule's methods take value receivers, so both PriorityEscalationRule and
// *PriorityEscalationRule satisfy RuleContract.
var _ contracts.RuleContract = PriorityEscalationRule{}

// PriorityEscalationRule is the priority-escalation rule.
type PriorityEscalationRule struct{}

// Key is the rule identifier.
func (PriorityEscalationRule) Key() string {
	return "priority-escalation"
}

// Evaluate reports whether the rule holds on this dataset.
func (r PriorityEscalationRule) Evaluate(data *dataset.Dataset) bool {
	for _, order := range data.Orders {
		if order.Priority != coresupport.PriorityStandard {
			return true
		}
	}
	return false
}

// init registers this rule.
func init() {
	Register(PriorityEscalationRule{})
}
