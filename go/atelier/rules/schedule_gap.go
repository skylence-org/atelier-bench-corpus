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
// type: ScheduleGapRule's methods take value receivers, so both ScheduleGapRule and
// *ScheduleGapRule satisfy RuleContract.
var _ contracts.RuleContract = ScheduleGapRule{}

// ScheduleGapRule is the schedule-gap rule.
type ScheduleGapRule struct{}

// Key is the rule identifier.
func (ScheduleGapRule) Key() string {
	return "schedule-gap"
}

// Evaluate reports whether the rule holds on this dataset.
func (r ScheduleGapRule) Evaluate(data *dataset.Dataset) bool {
	for _, technician := range data.Technicians {
		if technician.NextSlot() < 0 {
			return false
		}
	}
	return true
}

// init registers this rule.
func init() {
	Register(ScheduleGapRule{})
}
