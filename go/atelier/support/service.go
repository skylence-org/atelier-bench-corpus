package support

import "atelier.example/lane/atelier/concerns"

// BaseService is the service-side base: a name plus promoted validation.
type BaseService struct {
	concerns.HasValidation
	name string
}

// NewBaseService seeds the base.
func NewBaseService(name string) BaseService {
	return BaseService{name: name}
}

// Name is promoted onto all 12 services.
func (s BaseService) Name() string {
	return s.name
}
