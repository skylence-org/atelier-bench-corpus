// Package services carries the 12 services. Note the name: core/services is a
// DIFFERENT package with the same name, and a file needing both aliases one.
package services

import (
	"atelier.example/lane/atelier/contracts"
	"atelier.example/lane/atelier/dataset"
	"atelier.example/lane/atelier/support"
)

// Compile-time proof of satisfaction.
var _ contracts.ServiceContract = (*ProfitMarginService)(nil)

// ProfitMarginService answers the profit-margin questions.
type ProfitMarginService struct {
	support.BaseService
}

// NewProfitMarginService builds the service.
func NewProfitMarginService() *ProfitMarginService {
	return &ProfitMarginService{BaseService: support.NewBaseService("profit-margin")}
}

// Ratio is gross profit over revenue.
func (s *ProfitMarginService) Ratio(data *dataset.Dataset) float64 {
	revenue := data.RevenueCents()
	if revenue == 0 {
		return 0
	}
	return float64(revenue-data.PartsCostCents()) / float64(revenue)
}

// Run renders the service result as report rows.
func (s *ProfitMarginService) Run(data *dataset.Dataset) []contracts.ReportRow {
	return []contracts.ReportRow{contracts.Row("ratio", s.Ratio(data))}
}
