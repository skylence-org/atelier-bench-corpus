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
// type: InvoiceBalanceRule's methods take value receivers, so both InvoiceBalanceRule and
// *InvoiceBalanceRule satisfy RuleContract.
var _ contracts.RuleContract = InvoiceBalanceRule{}

// InvoiceBalanceRule is the invoice-balance rule.
type InvoiceBalanceRule struct{}

// Key is the rule identifier.
func (InvoiceBalanceRule) Key() string {
	return "invoice-balance"
}

// Evaluate reports whether the rule holds on this dataset.
func (r InvoiceBalanceRule) Evaluate(data *dataset.Dataset) bool {
	for _, invoice := range data.Invoices {
		if invoice.Total.Cents() <= 0 {
			return false
		}
	}
	return true
}

// init registers this rule.
func init() {
	Register(InvoiceBalanceRule{})
}
