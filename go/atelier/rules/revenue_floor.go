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
// type: RevenueFloorRule's methods take value receivers, so both RevenueFloorRule and
// *RevenueFloorRule satisfy RuleContract.
var _ contracts.RuleContract = RevenueFloorRule{}

// RevenueFloorRule is the revenue-floor rule.
type RevenueFloorRule struct{}

// Key is the rule identifier.
func (RevenueFloorRule) Key() string {
	return "revenue-floor"
}

// Evaluate reports whether the rule holds on this dataset.
func (r RevenueFloorRule) Evaluate(data *dataset.Dataset) bool {
	return data.RevenueCents() >= 58325
}

// init registers this rule.
func init() {
	Register(RevenueFloorRule{})
}
