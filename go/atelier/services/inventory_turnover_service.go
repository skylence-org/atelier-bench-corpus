// Package services carries the 12 services. Note the name: core/services is a
// DIFFERENT package with the same name, and a file needing both aliases one.
package services

import (
	"atelier.example/lane/atelier/contracts"
	"atelier.example/lane/atelier/dataset"
	"atelier.example/lane/atelier/support"
)

// Compile-time proof of satisfaction.
var _ contracts.ServiceContract = (*InventoryTurnoverService)(nil)

// InventoryTurnoverService answers the inventory-turnover questions.
type InventoryTurnoverService struct {
	support.BaseService
}

// NewInventoryTurnoverService builds the service.
func NewInventoryTurnoverService() *InventoryTurnoverService {
	return &InventoryTurnoverService{BaseService: support.NewBaseService("inventory-turnover")}
}

// ForSKU is the turnover of one part, or false when the SKU is unknown.
func (s *InventoryTurnoverService) ForSKU(data *dataset.Dataset, sku string) (float64, bool) {
	part, found := data.Part(sku)
	if !found {
		return 0, false
	}
	if part.Stock == 0 {
		return 0, true
	}
	return float64(part.ConsumedQuantity()) / float64(part.Stock), true
}

// Run renders the service result as report rows.
func (s *InventoryTurnoverService) Run(data *dataset.Dataset) []contracts.ReportRow {
	rows := make([]contracts.ReportRow, 0, len(data.Parts))
	for _, part := range data.Parts {
		turnover, _ := s.ForSKU(data, part.SKU)
		rows = append(rows, contracts.Row(part.SKU, turnover))
	}
	return rows
}
