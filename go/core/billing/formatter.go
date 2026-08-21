// Package billing is one half of the SHADOW PAIR: it exports a type named
// Formatter, and so does core/reporting. The two are unrelated; consumers
// alias one or both at the import site.
package billing

import (
	"fmt"

	"atelier.example/lane/core/money"
)

// Formatter renders money. The reporting half renders statuses.
type Formatter struct {
	Currency string
}

// NewFormatter defaults to euros.
func NewFormatter(currency string) *Formatter {
	if currency == "" {
		currency = "EUR"
	}
	return &Formatter{Currency: currency}
}

// Money renders "349.00 EUR".
func (f *Formatter) Money(amount money.Money) string {
	return fmt.Sprintf("%s %s", amount, f.Currency)
}

// Line renders "2 x Battery 55Wh = 178.00 EUR".
func (f *Formatter) Line(quantity int, description string, amount money.Money) string {
	return fmt.Sprintf("%d x %s = %s", quantity, description, f.Money(amount))
}
