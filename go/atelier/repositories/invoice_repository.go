// Package repositories carries the 8 repositories. Each satisfies the GENERIC
// interface core/contracts.Repository[T] with its own element type; the only
// textual link is the compile-time assertion at the top of the file.
package repositories

import (
	"atelier.example/lane/core/contracts"
	"atelier.example/lane/core/models"
)

// Compile-time proof: the generic interface instantiated with *models.Invoice.
var _ contracts.Repository[*models.Invoice] = (*InvoiceRepository)(nil)

// InvoiceRepository holds the invoices in memory.
type InvoiceRepository struct {
	records []*models.Invoice
}

// NewInvoiceRepository builds a repository over the given records.
func NewInvoiceRepository(records []*models.Invoice) *InvoiceRepository {
	return &InvoiceRepository{records: records}
}

// All returns every record.
func (r *InvoiceRepository) All() []*models.Invoice {
	return r.records
}

// Find resolves one record by id.
func (r *InvoiceRepository) Find(id int) (*models.Invoice, bool) {
	for _, record := range r.records {
		if record.ID == id {
			return record, true
		}
	}
	var zero *models.Invoice
	return zero, false
}

// Count is how many records the repository holds.
func (r *InvoiceRepository) Count() int {
	return len(r.records)
}

// Unpaid is the repository-specific query.
func (r *InvoiceRepository) Unpaid() []*models.Invoice {
	found := make([]*models.Invoice, 0, len(r.records))
	for _, record := range r.records {
		if !record.Paid {
			found = append(found, record)
		}
	}
	return found
}
