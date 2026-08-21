// Package repositories carries the 8 repositories. Each satisfies the GENERIC
// interface core/contracts.Repository[T] with its own element type; the only
// textual link is the compile-time assertion at the top of the file.
package repositories

import (
	"atelier.example/lane/core/contracts"
	"atelier.example/lane/core/models"
)

// Compile-time proof: the generic interface instantiated with *models.RepairOrder.
var _ contracts.Repository[*models.RepairOrder] = (*OrderRepository)(nil)

// OrderRepository holds the orders in memory.
type OrderRepository struct {
	records []*models.RepairOrder
}

// NewOrderRepository builds a repository over the given records.
func NewOrderRepository(records []*models.RepairOrder) *OrderRepository {
	return &OrderRepository{records: records}
}

// All returns every record.
func (r *OrderRepository) All() []*models.RepairOrder {
	return r.records
}

// Find resolves one record by id.
func (r *OrderRepository) Find(id int) (*models.RepairOrder, bool) {
	for _, record := range r.records {
		if record.ID == id {
			return record, true
		}
	}
	var zero *models.RepairOrder
	return zero, false
}

// Count is how many records the repository holds.
func (r *OrderRepository) Count() int {
	return len(r.records)
}

// Open is the repository-specific query.
func (r *OrderRepository) Open() []*models.RepairOrder {
	found := make([]*models.RepairOrder, 0, len(r.records))
	for _, record := range r.records {
		if record.IsOpen() {
			found = append(found, record)
		}
	}
	return found
}
