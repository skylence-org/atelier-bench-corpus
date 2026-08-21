// Package repositories carries the 8 repositories. Each satisfies the GENERIC
// interface core/contracts.Repository[T] with its own element type; the only
// textual link is the compile-time assertion at the top of the file.
package repositories

import "atelier.example/lane/core/contracts"

// Payment is a settled amount against an invoice.
type Payment struct {
	ID        int
	InvoiceID int
	Cents     int64
}

// Compile-time proof: the generic interface instantiated with Payment.
var _ contracts.Repository[Payment] = (*PaymentRepository)(nil)

// PaymentRepository holds the payments in memory.
type PaymentRepository struct {
	records []Payment
}

// NewPaymentRepository builds a repository over the given records.
func NewPaymentRepository(records []Payment) *PaymentRepository {
	return &PaymentRepository{records: records}
}

// All returns every record.
func (r *PaymentRepository) All() []Payment {
	return r.records
}

// Find resolves one record by id.
func (r *PaymentRepository) Find(id int) (Payment, bool) {
	for _, record := range r.records {
		if record.ID == id {
			return record, true
		}
	}
	var zero Payment
	return zero, false
}

// Count is how many records the repository holds.
func (r *PaymentRepository) Count() int {
	return len(r.records)
}

// SettledCents is the repository-specific query.
func (r *PaymentRepository) SettledCents() int64 {
	total := int64(0)
	for _, record := range r.records {
		total += record.Cents
	}
	return total
}
