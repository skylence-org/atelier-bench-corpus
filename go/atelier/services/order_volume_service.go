// Package services carries the 12 services. Note the name: core/services is a
// DIFFERENT package with the same name, and a file needing both aliases one.
package services

import (
	"atelier.example/lane/atelier/contracts"
	"atelier.example/lane/atelier/dataset"
	"atelier.example/lane/atelier/support"
)

// Compile-time proof of satisfaction.
var _ contracts.ServiceContract = (*OrderVolumeService)(nil)

// OrderVolumeService answers the order-volume questions.
type OrderVolumeService struct {
	support.BaseService
}

// NewOrderVolumeService builds the service.
func NewOrderVolumeService() *OrderVolumeService {
	return &OrderVolumeService{BaseService: support.NewBaseService("order-volume")}
}

// Total is the order count.
func (s *OrderVolumeService) Total(data *dataset.Dataset) int {
	return len(data.Orders)
}

// ForCustomer is the order count of one customer.
func (s *OrderVolumeService) ForCustomer(data *dataset.Dataset, customerID int) int {
	return len(data.OrdersOf(customerID))
}

// By is STRING-KEYED DISPATCH: the scope selects a method value from a map
// built at run time, so no selector in this file names the chosen method.
func (s *OrderVolumeService) By(data *dataset.Dataset, scope string) int {
	scopes := map[string]func(*dataset.Dataset) int{
		"open":      s.ScopeOpen,
		"completed": s.ScopeCompleted,
	}
	handler, found := scopes[scope]
	if !found {
		return 0
	}
	return handler(data)
}

// ScopeOpen is reachable only through By("open").
func (s *OrderVolumeService) ScopeOpen(data *dataset.Dataset) int {
	return len(data.OpenOrders())
}

// ScopeCompleted is reachable only through By("completed").
func (s *OrderVolumeService) ScopeCompleted(data *dataset.Dataset) int {
	return len(data.CompletedOrders())
}

// Run renders the service result as report rows.
func (s *OrderVolumeService) Run(data *dataset.Dataset) []contracts.ReportRow {
	return []contracts.ReportRow{
		contracts.Row("open", float64(s.By(data, "open"))),
		contracts.Row("completed", float64(s.By(data, "completed"))),
	}
}
