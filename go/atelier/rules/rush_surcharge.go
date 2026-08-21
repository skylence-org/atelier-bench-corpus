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
// type: RushSurchargeRule's methods take value receivers, so both RushSurchargeRule and
// *RushSurchargeRule satisfy RuleContract.
var _ contracts.RuleContract = RushSurchargeRule{}

// RushSurchargeRule is the rush-surcharge rule.
type RushSurchargeRule struct{}

// Key is the rule identifier.
func (RushSurchargeRule) Key() string {
	return "rush-surcharge"
}

// Evaluate reports whether the rule holds on this dataset.
func (r RushSurchargeRule) Evaluate(data *dataset.Dataset) bool {
	for _, order := range data.Orders {
		if order.Priority == coresupport.PriorityRush {
			return true
		}
	}
	return false
}

// init registers this rule.
func init() {
	Register(RushSurchargeRule{})
}
