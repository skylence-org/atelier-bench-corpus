// Package rules carries the 48 rules: 24 NOMINAL rule structs in this package
// (each with a compile-time assertion against RuleContract and a value
// receiver) plus the 24 STRUCTURAL ad-hoc rule values from rules/adhoc, which
// assert nothing and satisfy the same method set by shape alone.
package rules

import (
	"atelier.example/lane/atelier/contracts"
	"atelier.example/lane/atelier/dataset"
)

// Compile-time proof against the NOMINAL contract, asserted on the VALUE
// type: SlotOverbookingRule's methods take value receivers, so both SlotOverbookingRule and
// *SlotOverbookingRule satisfy RuleContract.
var _ contracts.RuleContract = SlotOverbookingRule{}

// SlotOverbookingRule is the slot-overbooking rule.
type SlotOverbookingRule struct{}

// Key is the rule identifier.
func (SlotOverbookingRule) Key() string {
	return "slot-overbooking"
}

// Evaluate reports whether the rule holds on this dataset.
func (r SlotOverbookingRule) Evaluate(data *dataset.Dataset) bool {
	for _, technician := range data.Technicians {
		if technician.BookedCount() != 0 {
			return false
		}
	}
	return true
}

// init registers this rule.
func init() {
	Register(SlotOverbookingRule{})
}
