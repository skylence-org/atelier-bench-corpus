package concerns

import "fmt"

// HasFormatting supplies cell formatting by promotion.
type HasFormatting struct {
	Decimals int
}

// FormatCell renders a value with the configured precision.
func (h HasFormatting) FormatCell(value float64) string {
	decimals := h.Decimals
	if decimals == 0 {
		decimals = 2
	}
	return fmt.Sprintf("%.*f", decimals, value)
}
