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
// type: DepositRequiredRule's methods take value receivers, so both DepositRequiredRule and
// *DepositRequiredRule satisfy RuleContract.
var _ contracts.RuleContract = DepositRequiredRule{}

// DepositRequiredRule is the deposit-required rule.
type DepositRequiredRule struct{}

// Key is the rule identifier.
func (DepositRequiredRule) Key() string {
	return "deposit-required"
}

// Evaluate reports whether the rule holds on this dataset.
func (r DepositRequiredRule) Evaluate(data *dataset.Dataset) bool {
	return len(data.Invoices) >= 1
}

// init registers this rule.
func init() {
	Register(DepositRequiredRule{})
}
