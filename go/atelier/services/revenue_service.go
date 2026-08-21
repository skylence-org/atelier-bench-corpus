// Package services carries the 12 services. Note the name: core/services is a
// DIFFERENT package with the same name, and a file needing both aliases one.
package services

import (
	"atelier.example/lane/atelier/contracts"
	"atelier.example/lane/atelier/dataset"
	"atelier.example/lane/atelier/metrics"
	"atelier.example/lane/atelier/support"
)

// Compile-time proof of satisfaction.
var _ contracts.ServiceContract = (*RevenueService)(nil)

// RevenueService answers the revenue questions.
type RevenueService struct {
	support.BaseService
}

// NewRevenueService builds the service.
func NewRevenueService() *RevenueService {
	return &RevenueService{BaseService: support.NewBaseService("revenue")}
}

// TotalCents is the frozen revenue figure.
func (s *RevenueService) TotalCents(data *dataset.Dataset) int64 {
	return data.RevenueCents()
}

// MetricSweep computes every registered metric. The registry is filled by the
// init functions of the metrics package, not by anything visible here.
func (s *RevenueService) MetricSweep(data *dataset.Dataset) []contracts.ReportRow {
	rows := make([]contracts.ReportRow, 0, metrics.Count())
	for _, metric := range metrics.All() {
		rows = append(rows, contracts.Row(metric.Key(), metric.Compute(data)))
	}
	return rows
}

// Run renders the service result as report rows.
func (s *RevenueService) Run(data *dataset.Dataset) []contracts.ReportRow {
	return []contracts.ReportRow{contracts.RowFromCents("revenue", s.TotalCents(data))}
}
