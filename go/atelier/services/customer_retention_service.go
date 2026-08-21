// Package services carries the 12 services. Note the name: core/services is a
// DIFFERENT package with the same name, and a file needing both aliases one.
package services

import (
	"atelier.example/lane/atelier/contracts"
	"atelier.example/lane/atelier/dataset"
	"atelier.example/lane/atelier/support"
)

// Compile-time proof of satisfaction.
var _ contracts.ServiceContract = (*CustomerRetentionService)(nil)

// CustomerRetentionService answers the customer-retention questions.
type CustomerRetentionService struct {
	support.BaseService
}

// NewCustomerRetentionService builds the service.
func NewCustomerRetentionService() *CustomerRetentionService {
	return &CustomerRetentionService{BaseService: support.NewBaseService("customer-retention")}
}

// Rate is the share of customers with more than one order.
func (s *CustomerRetentionService) Rate(data *dataset.Dataset) float64 {
	if len(data.Customers) == 0 {
		return 0
	}
	repeat := 0
	for _, customer := range data.Customers {
		if len(data.OrdersOf(customer.ID)) > 1 {
			repeat++
		}
	}
	return float64(repeat) / float64(len(data.Customers))
}

// Run renders the service result as report rows.
func (s *CustomerRetentionService) Run(data *dataset.Dataset) []contracts.ReportRow {
	return []contracts.ReportRow{contracts.Row("rate", s.Rate(data))}
}
