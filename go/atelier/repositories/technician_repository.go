// Package repositories carries the 8 repositories. Each satisfies the GENERIC
// interface core/contracts.Repository[T] with its own element type; the only
// textual link is the compile-time assertion at the top of the file.
package repositories

import (
	"atelier.example/lane/core/contracts"
	"atelier.example/lane/core/models"
)

// Compile-time proof: the generic interface instantiated with *models.Technician.
var _ contracts.Repository[*models.Technician] = (*TechnicianRepository)(nil)

// TechnicianRepository holds the technicians in memory.
type TechnicianRepository struct {
	records []*models.Technician
}

// NewTechnicianRepository builds a repository over the given records.
func NewTechnicianRepository(records []*models.Technician) *TechnicianRepository {
	return &TechnicianRepository{records: records}
}

// All returns every record.
func (r *TechnicianRepository) All() []*models.Technician {
	return r.records
}

// Find resolves one record by id.
func (r *TechnicianRepository) Find(id int) (*models.Technician, bool) {
	for _, record := range r.records {
		if record.ID == id {
			return record, true
		}
	}
	var zero *models.Technician
	return zero, false
}

// Count is how many records the repository holds.
func (r *TechnicianRepository) Count() int {
	return len(r.records)
}

// Available is the repository-specific query.
func (r *TechnicianRepository) Available() []*models.Technician {
	found := make([]*models.Technician, 0, len(r.records))
	for _, record := range r.records {
		if record.NextSlot() >= 0 {
			found = append(found, record)
		}
	}
	return found
}
