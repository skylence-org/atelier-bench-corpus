// Package services carries the 12 services. Note the name: core/services is a
// DIFFERENT package with the same name, and a file needing both aliases one.
package services

import (
	"atelier.example/lane/atelier/contracts"
	"atelier.example/lane/atelier/dataset"
	"atelier.example/lane/atelier/support"
)

// Compile-time proof of satisfaction.
var _ contracts.ServiceContract = (*ChurnRiskService)(nil)

// ChurnRiskService answers the churn-risk questions.
type ChurnRiskService struct {
	support.BaseService
}

// NewChurnRiskService builds the service.
func NewChurnRiskService() *ChurnRiskService {
	return &ChurnRiskService{BaseService: support.NewBaseService("churn-risk")}
}

// AtRisk lists the customers with no open order left.
func (s *ChurnRiskService) AtRisk(data *dataset.Dataset) []int {
	ids := make([]int, 0, len(data.Customers))
	for _, customer := range data.Customers {
		stillOpen := false
		for _, order := range data.OrdersOf(customer.ID) {
			if order.IsOpen() {
				stillOpen = true
			}
		}
		if !stillOpen {
			ids = append(ids, customer.ID)
		}
	}
	return ids
}

// Run renders the service result as report rows.
func (s *ChurnRiskService) Run(data *dataset.Dataset) []contracts.ReportRow {
	return []contracts.ReportRow{contracts.Row("at risk", float64(len(s.AtRisk(data))))}
}
