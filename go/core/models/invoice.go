package models

import "atelier.example/lane/core/money"

// Invoice is the billed total of one repair order.
type Invoice struct {
	ID            int
	RepairOrderID int
	Total         money.Money
	Paid          bool
}

// NewInvoice builds an unpaid invoice.
func NewInvoice(id int, repairOrderID int, total money.Money) *Invoice {
	return &Invoice{ID: id, RepairOrderID: repairOrderID, Total: total}
}

// Outstanding is the unpaid remainder.
func (i *Invoice) Outstanding() money.Money {
	if i.Paid {
		return money.Zero
	}
	return i.Total
}

// Settle marks the invoice paid and reports whether anything changed.
func (i *Invoice) Settle() bool {
	if i.Paid {
		return false
	}
	i.Paid = true
	return true
}
