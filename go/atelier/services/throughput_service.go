// Package services carries the 12 services. Note the name: core/services is a
// DIFFERENT package with the same name, and a file needing both aliases one.
package services

import (
	"atelier.example/lane/atelier/contracts"
	"atelier.example/lane/atelier/dataset"
	"atelier.example/lane/atelier/support"
)

// Compile-time proof of satisfaction.
var _ contracts.ServiceContract = (*ThroughputService)(nil)

// ThroughputService answers the throughput questions.
type ThroughputService struct {
	support.BaseService
}

// NewThroughputService builds the service.
func NewThroughputService() *ThroughputService {
	return &ThroughputService{BaseService: support.NewBaseService("throughput")}
}

// Completed is how many orders left the workshop.
func (s *ThroughputService) Completed(data *dataset.Dataset) int {
	return len(data.CompletedOrders())
}

// Run renders the service result as report rows.
func (s *ThroughputService) Run(data *dataset.Dataset) []contracts.ReportRow {
	return []contracts.ReportRow{contracts.Row("completed", float64(s.Completed(data)))}
}
