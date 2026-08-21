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
// type: IdleTechnicianRule's methods take value receivers, so both IdleTechnicianRule and
// *IdleTechnicianRule satisfy RuleContract.
var _ contracts.RuleContract = IdleTechnicianRule{}

// IdleTechnicianRule is the idle-technician rule.
type IdleTechnicianRule struct{}

// Key is the rule identifier.
func (IdleTechnicianRule) Key() string {
	return "idle-technician"
}

// Evaluate reports whether the rule holds on this dataset.
func (r IdleTechnicianRule) Evaluate(data *dataset.Dataset) bool {
	return len(data.Technicians) >= len(data.OpenOrders())
}

// init registers this rule.
func init() {
	Register(IdleTechnicianRule{})
}
