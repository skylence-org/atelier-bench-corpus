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
// type: TechnicianCapacityRule's methods take value receivers, so both TechnicianCapacityRule and
// *TechnicianCapacityRule satisfy RuleContract.
var _ contracts.RuleContract = TechnicianCapacityRule{}

// TechnicianCapacityRule is the technician-capacity rule.
type TechnicianCapacityRule struct{}

// Key is the rule identifier.
func (TechnicianCapacityRule) Key() string {
	return "technician-capacity"
}

// Evaluate reports whether the rule holds on this dataset.
func (r TechnicianCapacityRule) Evaluate(data *dataset.Dataset) bool {
	return len(data.Technicians) >= 1
}

// init registers this rule.
func init() {
	Register(TechnicianCapacityRule{})
}
