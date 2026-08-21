// Package services carries the 12 services. Note the name: core/services is a
// DIFFERENT package with the same name, and a file needing both aliases one.
package services

import (
	"atelier.example/lane/atelier/contracts"
	"atelier.example/lane/atelier/dataset"
	"atelier.example/lane/atelier/support"
	coresupport "atelier.example/lane/core/support"
)

// Compile-time proof of satisfaction.
var _ contracts.ServiceContract = (*WarrantyClaimService)(nil)

// WarrantyClaimService answers the warranty-claim questions.
type WarrantyClaimService struct {
	support.BaseService
}

// NewWarrantyClaimService builds the service.
func NewWarrantyClaimService() *WarrantyClaimService {
	return &WarrantyClaimService{BaseService: support.NewBaseService("warranty-claim")}
}

// Count is how many orders are warranty work.
func (s *WarrantyClaimService) Count(data *dataset.Dataset) int {
	claims := 0
	for _, order := range data.Orders {
		if order.Priority == coresupport.PriorityWarranty {
			claims++
		}
	}
	return claims
}

// Run renders the service result as report rows.
func (s *WarrantyClaimService) Run(data *dataset.Dataset) []contracts.ReportRow {
	return []contracts.ReportRow{contracts.Row("claims", float64(s.Count(data)))}
}
