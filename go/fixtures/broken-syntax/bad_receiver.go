//go:build brokenfixtures

package brokensyntax

// Intentionally invalid: the receiver list is malformed, the return type is
// missing and the call has no closing parenthesis. Do not fix.
func (t *) Total(order int money.Money {
	total := 0
	for _, line := range order.Parts {
		total += line.UnitPrice.Times(line.Quantity
	}
	return total
}
