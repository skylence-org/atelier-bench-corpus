// Package services carries the two invoice calculators. Note the name: there
// is a SECOND services package under atelier/services with different types.
package services

import (
	"atelier.example/lane/core/contracts"
	"atelier.example/lane/core/models"
	"atelier.example/lane/core/money"
)

// DefaultRateCents is the flat labour rate per hour.
const DefaultRateCents = 7500

// Compile-time proof of interface satisfaction. This assertion is the ONLY
// textual link between the struct and the interface it satisfies.
var _ contracts.InvoiceCalculator = (*StandardInvoiceCalculator)(nil)

// StandardInvoiceCalculator prices labour at a flat rate plus parts.
type StandardInvoiceCalculator struct {
	LabourRateCentsPerHour int64
}

// NewStandardInvoiceCalculator uses the default rate.
func NewStandardInvoiceCalculator() *StandardInvoiceCalculator {
	return &StandardInvoiceCalculator{LabourRateCentsPerHour: DefaultRateCents}
}

// Calculate is labour plus parts.
func (c *StandardInvoiceCalculator) Calculate(order *models.RepairOrder) money.Money {
	return c.Labour(order).Plus(order.PartsSubtotal())
}

// Labour is the rate applied to the recorded minutes, truncated to the cent.
func (c *StandardInvoiceCalculator) Labour(order *models.RepairOrder) money.Money {
	return money.FromCents(c.LabourRateCentsPerHour * int64(order.LaborMinutes) / 60)
}

// Name identifies the binding in the report payload.
func (c *StandardInvoiceCalculator) Name() string {
	return "standard"
}

// AppliesSurcharge is false for standard pricing.
func (c *StandardInvoiceCalculator) AppliesSurcharge() bool {
	return false
}
