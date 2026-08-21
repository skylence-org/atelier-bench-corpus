// Package services carries the 12 services. Note the name: core/services is a
// DIFFERENT package with the same name, and a file needing both aliases one.
package services

import (
	"atelier.example/lane/atelier/contracts"
	"atelier.example/lane/atelier/dataset"
	"atelier.example/lane/atelier/support"
)

// Compile-time proof of satisfaction.
var _ contracts.ServiceContract = (*PartUsageService)(nil)

// PartUsageService answers the part-usage questions.
type PartUsageService struct {
	support.BaseService
}

// NewPartUsageService builds the service.
func NewPartUsageService() *PartUsageService {
	return &PartUsageService{BaseService: support.NewBaseService("part-usage")}
}

// ConsumedUnits is how many part units left the shelf.
func (s *PartUsageService) ConsumedUnits(data *dataset.Dataset) int {
	units := 0
	for _, part := range data.Parts {
		units += part.ConsumedQuantity()
	}
	return units
}

// Run renders the service result as report rows.
func (s *PartUsageService) Run(data *dataset.Dataset) []contracts.ReportRow {
	return []contracts.ReportRow{contracts.Row("units", float64(s.ConsumedUnits(data)))}
}
