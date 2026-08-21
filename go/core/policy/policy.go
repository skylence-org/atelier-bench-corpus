// Package policy answers "may this actor do this", the way a framework gate
// would: a method per ability, dispatched by a string name.
package policy

import (
	"atelier.example/lane/core/models"
	"atelier.example/lane/core/support"
)

// Actor is whoever is asking.
type Actor struct {
	ID   int
	Role string
}

// NewActor builds an actor.
func NewActor(id int, role string) Actor {
	return Actor{ID: id, Role: role}
}

// RepairOrderPolicy carries the abilities for one model.
type RepairOrderPolicy struct{}

// NewRepairOrderPolicy builds the policy.
func NewRepairOrderPolicy() *RepairOrderPolicy {
	return &RepairOrderPolicy{}
}

// CanView is open to the owner and to staff.
func (p *RepairOrderPolicy) CanView(actor Actor, order *models.RepairOrder) bool {
	return actor.Role != "guest" || actor.ID == order.CustomerID
}

// CanCollect requires a completed order and the owning customer.
func (p *RepairOrderPolicy) CanCollect(actor Actor, order *models.RepairOrder) bool {
	if order.Status != support.StatusCompleted {
		return false
	}
	return actor.ID == order.CustomerID
}

// CanEdit is staff only.
func (p *RepairOrderPolicy) CanEdit(actor Actor, order *models.RepairOrder) bool {
	return actor.Role == "technician" || actor.Role == "manager"
}

// Allows dispatches an ability by STRING NAME, which is the edge a static
// tool has to guess: the method is chosen from a value, not from a selector.
func (p *RepairOrderPolicy) Allows(ability string, actor Actor, order *models.RepairOrder) bool {
	switch ability {
	case "view":
		return p.CanView(actor, order)
	case "collect":
		return p.CanCollect(actor, order)
	case "edit":
		return p.CanEdit(actor, order)
	default:
		return false
	}
}
