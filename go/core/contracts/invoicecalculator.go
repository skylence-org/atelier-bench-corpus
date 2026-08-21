// Package contracts holds the interfaces the core exposes. Go has no
// implements keyword: every concrete type below is matched STRUCTURALLY, and
// the only textual evidence is a compile-time assertion in the implementor.
package contracts

import (
	"atelier.example/lane/core/models"
	"atelier.example/lane/core/money"
)

// InvoiceCalculator is the pricing contract. models.Calculator is the smaller
// interface the model itself accepts; every calculator satisfies both.
type InvoiceCalculator interface {
	Calculate(order *models.RepairOrder) money.Money
	Name() string
	AppliesSurcharge() bool
}

// CalculatorFunc adapts a plain function to InvoiceCalculator, the way
// http.HandlerFunc adapts a function to http.Handler.
type CalculatorFunc func(order *models.RepairOrder) money.Money

// Calculate calls the function itself.
func (f CalculatorFunc) Calculate(order *models.RepairOrder) money.Money {
	return f(order)
}

// Name is fixed for every function-backed calculator.
func (f CalculatorFunc) Name() string {
	return "func"
}

// AppliesSurcharge is false: a bare function never surcharges.
func (f CalculatorFunc) AppliesSurcharge() bool {
	return false
}
