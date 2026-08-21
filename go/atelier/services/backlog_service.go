// Package services carries the 12 services. Note the name: core/services is a
// DIFFERENT package with the same name, and a file needing both aliases one.
package services

import (
	"atelier.example/lane/atelier/contracts"
	"atelier.example/lane/atelier/dataset"
	"atelier.example/lane/atelier/support"
)

// Compile-time proof of satisfaction.
var _ contracts.ServiceContract = (*BacklogService)(nil)

// BacklogService answers the backlog questions.
type BacklogService struct {
	support.BaseService
}

// NewBacklogService builds the service.
func NewBacklogService() *BacklogService {
	return &BacklogService{BaseService: support.NewBaseService("backlog")}
}

// Depth is how many orders are still open. It drives the dataset's
// range-over-func iterator, so the loop variable is produced by a closure.
func (s *BacklogService) Depth(data *dataset.Dataset) int {
	depth := 0
	for order := range data.Iterate() {
		if order.IsOpen() {
			depth++
		}
	}
	return depth
}

// Run renders the service result as report rows.
func (s *BacklogService) Run(data *dataset.Dataset) []contracts.ReportRow {
	return []contracts.ReportRow{contracts.Row("depth", float64(s.Depth(data)))}
}
