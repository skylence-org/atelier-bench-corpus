package models

import (
	"atelier.example/lane/core/concerns"
	"atelier.example/lane/core/support"
)

// Staff is the intermediate embedder: it embeds HasReference itself, so a
// type embedding Staff reaches Reference() at TWO levels of promotion.
type Staff struct {
	concerns.HasReference
	Name string
}

// Technician embeds Staff (two-level promotion of Reference) and a POINTER to
// a Schedule (one-level promotion of NextSlot, BookSlot and BookedCount).
// Neither promoted method is declared anywhere in this file.
type Technician struct {
	Staff
	*support.Schedule
	ID       int
	Capacity int
}

// NewTechnician builds a technician with an empty schedule.
func NewTechnician(id int, name string) *Technician {
	return &Technician{
		Staff:    Staff{HasReference: concerns.NewHasReference("TE", id), Name: name},
		Schedule: support.NewSchedule(),
		ID:       id,
		Capacity: support.SlotCount,
	}
}

// Utilisation is booked slots over capacity.
func (t *Technician) Utilisation() float64 {
	if t.Capacity == 0 {
		return 0
	}
	return float64(t.BookedCount()) / float64(t.Capacity)
}

// IsIdle is true while nothing is booked.
func (t *Technician) IsIdle() bool {
	return t.BookedCount() == 0
}
