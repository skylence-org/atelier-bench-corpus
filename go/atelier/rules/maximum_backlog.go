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
// type: MaximumBacklogRule's methods take value receivers, so both MaximumBacklogRule and
// *MaximumBacklogRule satisfy RuleContract.
var _ contracts.RuleContract = MaximumBacklogRule{}

// MaximumBacklogRule is the maximum-backlog rule.
type MaximumBacklogRule struct{}

// Key is the rule identifier.
func (MaximumBacklogRule) Key() string {
	return "maximum-backlog"
}

// Evaluate reports whether the rule holds on this dataset.
func (r MaximumBacklogRule) Evaluate(data *dataset.Dataset) bool {
	return len(data.OpenOrders()) <= len(data.Orders)
}

// init registers this rule.
func init() {
	Register(MaximumBacklogRule{})
}
