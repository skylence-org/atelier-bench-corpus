// Package money models a cent-precise amount as an immutable VALUE type.
//
// Every method has a VALUE receiver, so Money is copied on every call and a
// nil receiver is impossible; the mutable domain types (models.RepairOrder)
// use pointer receivers instead. Zero is the additive identity.
package money

import (
	"fmt"
	"regexp"
	"strconv"
	"strings"
)

// Zero is the additive identity, the package-level constant every lane carries.
var Zero = Money{cents: 0}

var moneyPattern = regexp.MustCompile(`^-?\d+(\.\d{1,2})?$`)

// Money is a cent amount. The field is unexported: construction goes through
// FromCents or Parse, and arithmetic returns new values.
type Money struct {
	cents int64
}

// FromCents builds a Money from a raw cent count.
func FromCents(cents int64) Money {
	return Money{cents: cents}
}

// Parse reads "12.34" and rejects anything else.
func Parse(raw string) (Money, error) {
	trimmed := strings.TrimSpace(raw)
	if !moneyPattern.MatchString(trimmed) {
		return Zero, fmt.Errorf("malformed money value %q", raw)
	}
	whole, fraction, found := strings.Cut(trimmed, ".")
	if !found {
		fraction = "0"
	}
	units, err := strconv.ParseInt(whole, 10, 64)
	if err != nil {
		return Zero, fmt.Errorf("malformed money value %q", raw)
	}
	subunits, err := strconv.ParseInt((fraction + "00")[:2], 10, 64)
	if err != nil {
		return Zero, fmt.Errorf("malformed money value %q", raw)
	}
	if units < 0 {
		subunits = -subunits
	}
	return Money{cents: units*100 + subunits}, nil
}

// Sum folds any sequence of amounts into one.
func Sum(amounts []Money) Money {
	total := Zero
	for _, amount := range amounts {
		total = total.Plus(amount)
	}
	return total
}

// Cents is the accessor the whole corpus scores against.
func (m Money) Cents() int64 {
	return m.cents
}

// Euros truncates towards zero.
func (m Money) Euros() int64 {
	return m.cents / 100
}

// WithSurchargeBp adds a basis-point surcharge, rounded half-up on the cent.
func (m Money) WithSurchargeBp(bp int64) Money {
	return Money{cents: m.cents + (m.cents*bp+5000)/10000}
}

// Plus returns the sum of two amounts.
func (m Money) Plus(other Money) Money {
	return Money{cents: m.cents + other.cents}
}

// Minus returns the difference of two amounts.
func (m Money) Minus(other Money) Money {
	return Money{cents: m.cents - other.cents}
}

// Times scales an amount by a whole factor.
func (m Money) Times(factor int64) Money {
	return Money{cents: m.cents * factor}
}

// Negate flips the sign.
func (m Money) Negate() Money {
	return Money{cents: -m.cents}
}

// IsZero reports whether the amount is exactly zero.
func (m Money) IsZero() bool {
	return m.cents == 0
}

// LessThan is the ordering the reports sort on.
func (m Money) LessThan(other Money) bool {
	return m.cents < other.cents
}

// String renders "349.00"; it makes Money a fmt.Stringer.
func (m Money) String() string {
	sign := ""
	magnitude := m.cents
	if magnitude < 0 {
		sign = "-"
		magnitude = -magnitude
	}
	return fmt.Sprintf("%s%d.%02d", sign, magnitude/100, magnitude%100)
}
