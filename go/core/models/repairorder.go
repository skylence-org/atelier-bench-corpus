package models

import (
	"atelier.example/lane/core/concerns"
	"atelier.example/lane/core/failure"
	"atelier.example/lane/core/money"
	"atelier.example/lane/core/support"
)

// PartLine is one consumed part on an order.
type PartLine struct {
	PartID    int
	SKU       string
	Quantity  int
	UnitPrice money.Money
}

// LogEntry is one recorded lifecycle move.
type LogEntry struct {
	From      support.RepairStatus
	To        support.RepairStatus
	ChangedBy string
}

// Calculator is declared HERE, in the package that consumes it, so models
// depends on no service package. Every calculator satisfies it structurally.
type Calculator interface {
	Calculate(order *RepairOrder) money.Money
}

// RepairOrder is the lifecycle hub. It EMBEDS concerns.HasReference, so
// Reference() is promoted onto it and declared nowhere in this file.
type RepairOrder struct {
	concerns.HasReference
	ID           int
	CustomerID   int
	DeviceID     int
	Status       support.RepairStatus
	Priority     support.Priority
	LaborMinutes int
	Parts        []PartLine
	Log          []LogEntry
}

// SeedRepairOrder builds the frozen-seed order: status received, priority
// standard (the zero value of both enums) and the reference number set.
func SeedRepairOrder(id int, customerID int, deviceID int) *RepairOrder {
	return &RepairOrder{
		HasReference: concerns.NewHasReference(support.AtelierPrefix, id),
		ID:           id,
		CustomerID:   customerID,
		DeviceID:     deviceID,
	}
}

// TransitionTo moves the order one step and records it, or refuses.
func (o *RepairOrder) TransitionTo(next support.RepairStatus, changedBy string) bool {
	if !o.Status.CanTransitionTo(next) {
		return false
	}
	o.Log = append(o.Log, LogEntry{From: o.Status, To: next, ChangedBy: changedBy})
	o.Status = next
	return true
}

// Complete is the refusing wrapper: it returns a wrapped sentinel error.
func (o *RepairOrder) Complete(changedBy string) error {
	if !o.TransitionTo(support.StatusCompleted, changedBy) {
		return failure.NewTransition(o.Status.String(), support.StatusCompleted.String())
	}
	return nil
}

// AddPart records a consumed part line.
func (o *RepairOrder) AddPart(part *Part, quantity int) {
	o.Parts = append(o.Parts, PartLine{PartID: part.ID, SKU: part.SKU, Quantity: quantity, UnitPrice: part.UnitPrice})
	part.Consume(quantity)
}

// PartsSubtotal is the sum of every part line.
func (o *RepairOrder) PartsSubtotal() money.Money {
	lines := make([]money.Money, 0, len(o.Parts))
	for _, line := range o.Parts {
		lines = append(lines, line.UnitPrice.Times(int64(line.Quantity)))
	}
	return money.Sum(lines)
}

// Total prices the order through whichever calculator is bound.
func (o *RepairOrder) Total(calculator Calculator) money.Money {
	return calculator.Calculate(o)
}

// IsOpen is true while the order is still in the workshop.
func (o *RepairOrder) IsOpen() bool {
	return o.Status.IsOpen()
}
