package services

import (
	"atelier.example/lane/core/contracts"
	"atelier.example/lane/core/models"
	"atelier.example/lane/core/money"
)

// RushFlag is the feature flag name the rush binding reports under.
const RushFlag = "rush-surcharge"

// The rush calculator satisfies the same interface through the same kind of
// assertion; nothing else in this file names InvoiceCalculator.
var _ contracts.InvoiceCalculator = (*RushInvoiceCalculator)(nil)

// RushInvoiceCalculator COMPOSES the standard calculator by embedding a
// pointer to it: Labour() is promoted, Calculate() is overridden below.
type RushInvoiceCalculator struct {
	*StandardInvoiceCalculator
}

// NewRushInvoiceCalculator wraps a fresh standard calculator.
func NewRushInvoiceCalculator() *RushInvoiceCalculator {
	return &RushInvoiceCalculator{StandardInvoiceCalculator: NewStandardInvoiceCalculator()}
}

// Calculate SHADOWS the promoted method: the embedded calculator prices the
// base, then the priority surcharge is applied on billable orders only.
func (c *RushInvoiceCalculator) Calculate(order *models.RepairOrder) money.Money {
	base := c.StandardInvoiceCalculator.Calculate(order)
	if !order.Priority.IsBillable() {
		return base
	}
	return base.WithSurchargeBp(order.Priority.SurchargeBp())
}

// Name shadows the promoted Name.
func (c *RushInvoiceCalculator) Name() string {
	return "rush"
}

// AppliesSurcharge shadows the promoted AppliesSurcharge.
func (c *RushInvoiceCalculator) AppliesSurcharge() bool {
	return true
}
