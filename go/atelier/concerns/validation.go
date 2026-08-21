package concerns

import "strings"

// HasValidation supplies error collection by promotion.
type HasValidation struct {
	errors []string
}

// AddError records one validation failure.
func (h *HasValidation) AddError(message string) {
	h.errors = append(h.errors, message)
}

// IsValid is true while nothing failed.
func (h *HasValidation) IsValid() bool {
	return len(h.errors) == 0
}

// ErrorSummary joins the failures.
func (h *HasValidation) ErrorSummary() string {
	return strings.Join(h.errors, "; ")
}
