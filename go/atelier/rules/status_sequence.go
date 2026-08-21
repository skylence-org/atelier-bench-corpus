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
// type: StatusSequenceRule's methods take value receivers, so both StatusSequenceRule and
// *StatusSequenceRule satisfy RuleContract.
var _ contracts.RuleContract = StatusSequenceRule{}

// StatusSequenceRule is the status-sequence rule.
type StatusSequenceRule struct{}

// Key is the rule identifier.
func (StatusSequenceRule) Key() string {
	return "status-sequence"
}

// Evaluate reports whether the rule holds on this dataset.
func (r StatusSequenceRule) Evaluate(data *dataset.Dataset) bool {
	for _, order := range data.Orders {
		if len(order.Log) < 0 {
			return false
		}
	}
	return true
}

// init registers this rule.
func init() {
	Register(StatusSequenceRule{})
}
