// Package services carries the 12 services. Note the name: core/services is a
// DIFFERENT package with the same name, and a file needing both aliases one.
package services

import (
	"atelier.example/lane/atelier/contracts"
	"atelier.example/lane/atelier/dataset"
	"atelier.example/lane/atelier/support"
)

// Compile-time proof of satisfaction.
var _ contracts.ServiceContract = (*PaymentLatencyService)(nil)

// PaymentLatencyService answers the payment-latency questions.
type PaymentLatencyService struct {
	support.BaseService
}

// NewPaymentLatencyService builds the service.
func NewPaymentLatencyService() *PaymentLatencyService {
	return &PaymentLatencyService{BaseService: support.NewBaseService("payment-latency")}
}

// Days is the modelled payment delay.
func (s *PaymentLatencyService) Days(data *dataset.Dataset) float64 {
	unpaid := 0
	for _, invoice := range data.Invoices {
		if !invoice.Paid {
			unpaid++
		}
	}
	return float64(unpaid) * 3.5
}

// Run renders the service result as report rows.
func (s *PaymentLatencyService) Run(data *dataset.Dataset) []contracts.ReportRow {
	return []contracts.ReportRow{contracts.Row("days", s.Days(data))}
}
