// Package repositories carries the 8 repositories. Each satisfies the GENERIC
// interface core/contracts.Repository[T] with its own element type; the only
// textual link is the compile-time assertion at the top of the file.
package repositories

import (
	"atelier.example/lane/core/contracts"
	"atelier.example/lane/core/models"
)

// Compile-time proof: the generic interface instantiated with *models.Customer.
var _ contracts.Repository[*models.Customer] = (*CustomerRepository)(nil)

// CustomerRepository holds the customers in memory.
type CustomerRepository struct {
	records []*models.Customer
}

// NewCustomerRepository builds a repository over the given records.
func NewCustomerRepository(records []*models.Customer) *CustomerRepository {
	return &CustomerRepository{records: records}
}

// All returns every record.
func (r *CustomerRepository) All() []*models.Customer {
	return r.records
}

// Find resolves one record by id.
func (r *CustomerRepository) Find(id int) (*models.Customer, bool) {
	for _, record := range r.records {
		if record.ID == id {
			return record, true
		}
	}
	var zero *models.Customer
	return zero, false
}

// Count is how many records the repository holds.
func (r *CustomerRepository) Count() int {
	return len(r.records)
}

// Reachable is the repository-specific query.
func (r *CustomerRepository) Reachable() []*models.Customer {
	found := make([]*models.Customer, 0, len(r.records))
	for _, record := range r.records {
		if record.IsReachable() {
			found = append(found, record)
		}
	}
	return found
}
