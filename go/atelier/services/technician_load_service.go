// Package services carries the 12 services. Note the name: core/services is a
// DIFFERENT package with the same name, and a file needing both aliases one.
package services

import (
	"atelier.example/lane/atelier/contracts"
	"atelier.example/lane/atelier/dataset"
	"atelier.example/lane/atelier/support"
)

// Compile-time proof of satisfaction.
var _ contracts.ServiceContract = (*TechnicianLoadService)(nil)

// TechnicianLoadService answers the technician-load questions.
type TechnicianLoadService struct {
	support.BaseService
}

// NewTechnicianLoadService builds the service.
func NewTechnicianLoadService() *TechnicianLoadService {
	return &TechnicianLoadService{BaseService: support.NewBaseService("technician-load")}
}

// MeanUtilisation is the average technician utilisation.
func (s *TechnicianLoadService) MeanUtilisation(data *dataset.Dataset) float64 {
	if len(data.Technicians) == 0 {
		return 0
	}
	total := 0.0
	for _, technician := range data.Technicians {
		total += technician.Utilisation()
	}
	return total / float64(len(data.Technicians))
}

// Run renders the service result as report rows.
func (s *TechnicianLoadService) Run(data *dataset.Dataset) []contracts.ReportRow {
	return []contracts.ReportRow{contracts.Row("mean", s.MeanUtilisation(data))}
}
