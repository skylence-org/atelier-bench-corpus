// Package repositories carries the 8 repositories. Each satisfies the GENERIC
// interface core/contracts.Repository[T] with its own element type; the only
// textual link is the compile-time assertion at the top of the file.
package repositories

import (
	"atelier.example/lane/core/contracts"
	"atelier.example/lane/core/models"
)

// Compile-time proof: the generic interface instantiated with *models.Part.
var _ contracts.Repository[*models.Part] = (*PartRepository)(nil)

// PartRepository holds the parts in memory.
type PartRepository struct {
	records []*models.Part
}

// NewPartRepository builds a repository over the given records.
func NewPartRepository(records []*models.Part) *PartRepository {
	return &PartRepository{records: records}
}

// All returns every record.
func (r *PartRepository) All() []*models.Part {
	return r.records
}

// Find resolves one record by id.
func (r *PartRepository) Find(id int) (*models.Part, bool) {
	for _, record := range r.records {
		if record.ID == id {
			return record, true
		}
	}
	var zero *models.Part
	return zero, false
}

// Count is how many records the repository holds.
func (r *PartRepository) Count() int {
	return len(r.records)
}

// BySKU is the repository-specific query.
func (r *PartRepository) BySKU(sku string) (*models.Part, bool) {
	for _, record := range r.records {
		if record.SKU == sku {
			return record, true
		}
	}
	return nil, false
}
