// Package app wires the lane together: state, console commands, jobs and the
// HTTP surface live under it.
package app

import (
	"atelier.example/lane/atelier/dataset"
	moneyfmt "atelier.example/lane/core/billing"
	"atelier.example/lane/core/container"
	statusfmt "atelier.example/lane/core/reporting"
)

// State is the application state. The two same-name Formatter types are
// ALIASED at the import site: core/billing.Formatter formats money,
// core/reporting.Formatter formats statuses, and nothing downstream ever sees
// the bare name.
type State struct {
	Container *container.Container
	Data      *dataset.Dataset
	Money     *moneyfmt.Formatter
	Status    *statusfmt.Formatter
}

// SeededState is the default binding: standard invoice calculator.
func SeededState() *State {
	return &State{
		Container: container.BindDefault(),
		Data:      dataset.Seeded(),
		Money:     moneyfmt.NewFormatter("EUR"),
		Status:    statusfmt.NewFormatter("en"),
	}
}

// SeededRushState is the same state with the rush calculator bound instead.
func SeededRushState() *State {
	state := SeededState()
	state.Container = container.BindRush()
	return state
}
