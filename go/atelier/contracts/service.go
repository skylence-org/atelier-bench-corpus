package contracts

import "atelier.example/lane/atelier/dataset"

// ServiceContract is what all 12 services satisfy.
type ServiceContract interface {
	Name() string
	Run(data *dataset.Dataset) []ReportRow
}

// RepositoryContract is the bench-side repository shape; core/contracts has
// the generic one this specialises.
type RepositoryContract interface {
	Table() string
	Count(data *dataset.Dataset) int
}
