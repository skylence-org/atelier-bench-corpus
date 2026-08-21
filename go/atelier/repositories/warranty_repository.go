// Package repositories carries the 8 repositories. Each satisfies the GENERIC
// interface core/contracts.Repository[T] with its own element type; the only
// textual link is the compile-time assertion at the top of the file.
package repositories

import "atelier.example/lane/core/contracts"

// Claim is a warranty claim against an order.
type Claim struct {
	ID      int
	OrderID int
	Settled bool
}

// Compile-time proof: the generic interface instantiated with Claim.
var _ contracts.Repository[Claim] = (*WarrantyRepository)(nil)

// WarrantyRepository holds the claims in memory.
type WarrantyRepository struct {
	records []Claim
}

// NewWarrantyRepository builds a repository over the given records.
func NewWarrantyRepository(records []Claim) *WarrantyRepository {
	return &WarrantyRepository{records: records}
}

// All returns every record.
func (r *WarrantyRepository) All() []Claim {
	return r.records
}

// Find resolves one record by id.
func (r *WarrantyRepository) Find(id int) (Claim, bool) {
	for _, record := range r.records {
		if record.ID == id {
			return record, true
		}
	}
	var zero Claim
	return zero, false
}

// Count is how many records the repository holds.
func (r *WarrantyRepository) Count() int {
	return len(r.records)
}

// Pending is the repository-specific query.
func (r *WarrantyRepository) Pending() []Claim {
	found := make([]Claim, 0, len(r.records))
	for _, record := range r.records {
		if !record.Settled {
			found = append(found, record)
		}
	}
	return found
}
