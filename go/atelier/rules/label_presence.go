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
// type: LabelPresenceRule's methods take value receivers, so both LabelPresenceRule and
// *LabelPresenceRule satisfy RuleContract.
var _ contracts.RuleContract = LabelPresenceRule{}

// LabelPresenceRule is the label-presence rule.
type LabelPresenceRule struct{}

// Key is the rule identifier.
func (LabelPresenceRule) Key() string {
	return "label-presence"
}

// Evaluate reports whether the rule holds on this dataset.
func (r LabelPresenceRule) Evaluate(data *dataset.Dataset) bool {
	for _, part := range data.Parts {
		if len(part.Name) == 0 {
			return false
		}
	}
	return true
}

// init registers this rule.
func init() {
	Register(LabelPresenceRule{})
}
