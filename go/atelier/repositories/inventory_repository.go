// Package repositories carries the 8 repositories. Each satisfies the GENERIC
// interface core/contracts.Repository[T] with its own element type; the only
// textual link is the compile-time assertion at the top of the file.
package repositories

import "atelier.example/lane/core/contracts"

// Movement is a stock movement, a record type this package owns.
type Movement struct {
	ID    int
	SKU   string
	Delta int
}

// Compile-time proof: the generic interface instantiated with Movement.
var _ contracts.Repository[Movement] = (*InventoryRepository)(nil)

// InventoryRepository holds the movements in memory.
type InventoryRepository struct {
	records []Movement
}

// NewInventoryRepository builds a repository over the given records.
func NewInventoryRepository(records []Movement) *InventoryRepository {
	return &InventoryRepository{records: records}
}

// All returns every record.
func (r *InventoryRepository) All() []Movement {
	return r.records
}

// Find resolves one record by id.
func (r *InventoryRepository) Find(id int) (Movement, bool) {
	for _, record := range r.records {
		if record.ID == id {
			return record, true
		}
	}
	var zero Movement
	return zero, false
}

// Count is how many records the repository holds.
func (r *InventoryRepository) Count() int {
	return len(r.records)
}

// NetFor is the repository-specific query.
func (r *InventoryRepository) NetFor(sku string) int {
	net := 0
	for _, record := range r.records {
		if record.SKU == sku {
			net += record.Delta
		}
	}
	return net
}
