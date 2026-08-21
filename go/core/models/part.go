package models

import "atelier.example/lane/core/money"

// Part is a stock item.
type Part struct {
	ID           int
	SKU          string
	Name         string
	UnitPrice    money.Money
	Stock        int
	ReorderLevel int
	consumed     int
}

// NewPart takes SIX parameters in FOUR groups: `sku, name string` and
// `stock, reorderLevel int` each share one type.
func NewPart(id int, sku, name string, unitPrice money.Money, stock, reorderLevel int) *Part {
	return &Part{ID: id, SKU: sku, Name: name, UnitPrice: unitPrice, Stock: stock, ReorderLevel: reorderLevel}
}

// SeedPart is the two-group form of the same constructor, with the default
// reorder level of 2 every lane uses.
func SeedPart(id int, sku string, name string, unitPrice money.Money, stock int) *Part {
	return NewPart(id, sku, name, unitPrice, stock, 2)
}

// Consume records that a quantity left the shelf.
func (p *Part) Consume(quantity int) {
	p.consumed += quantity
}

// ConsumedQuantity is the running total of consumed units.
func (p *Part) ConsumedQuantity() int {
	return p.consumed
}

// IsLowStock is true at or below the reorder level.
func (p *Part) IsLowStock() bool {
	return p.Stock <= p.ReorderLevel
}

// LineTotal is the price of `quantity` of this part.
func (p *Part) LineTotal(quantity int) money.Money {
	return p.UnitPrice.Times(int64(quantity))
}
