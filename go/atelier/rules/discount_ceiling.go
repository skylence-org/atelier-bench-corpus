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
// type: DiscountCeilingRule's methods take value receivers, so both DiscountCeilingRule and
// *DiscountCeilingRule satisfy RuleContract.
var _ contracts.RuleContract = DiscountCeilingRule{}

// DiscountCeilingRule is the discount-ceiling rule.
type DiscountCeilingRule struct{}

// Key is the rule identifier.
func (DiscountCeilingRule) Key() string {
	return "discount-ceiling"
}

// Evaluate reports whether the rule holds on this dataset.
func (r DiscountCeilingRule) Evaluate(data *dataset.Dataset) bool {
	return data.RevenueCents() > 0
}

// init registers this rule.
func init() {
	Register(DiscountCeilingRule{})
}
