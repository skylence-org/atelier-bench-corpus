// Package reporting is the other half of the shadow pair: same type name,
// different method set, no relationship to core/billing.
package reporting

import (
	"fmt"

	"atelier.example/lane/core/support"
)

// Formatter renders statuses. The billing half renders money.
type Formatter struct {
	Locale string
}

// NewFormatter defaults to English.
func NewFormatter(locale string) *Formatter {
	if locale == "" {
		locale = "en"
	}
	return &Formatter{Locale: locale}
}

// StatusLine renders "Completed since intake".
func (f *Formatter) StatusLine(status support.RepairStatus, since string) string {
	if since == "" {
		return status.Label()
	}
	return fmt.Sprintf("%s since %s", status.Label(), since)
}

// LocaleTag is the configured locale.
func (f *Formatter) LocaleTag() string {
	return f.Locale
}
