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
// type: RepairDurationRule's methods take value receivers, so both RepairDurationRule and
// *RepairDurationRule satisfy RuleContract.
var _ contracts.RuleContract = RepairDurationRule{}

// RepairDurationRule is the repair-duration rule.
type RepairDurationRule struct{}

// Key is the rule identifier.
func (RepairDurationRule) Key() string {
	return "repair-duration"
}

// Evaluate reports whether the rule holds on this dataset.
func (r RepairDurationRule) Evaluate(data *dataset.Dataset) bool {
	return data.LabourMinutes() > 0
}

// init registers this rule.
func init() {
	Register(RepairDurationRule{})
}
