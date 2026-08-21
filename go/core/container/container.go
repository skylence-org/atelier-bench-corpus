// Package container is the tiny service locator: one bound calculator plus a
// STRING-KEYED factory table, which is the edge a static tool cannot follow.
package container

import (
	"sort"

	"atelier.example/lane/core/contracts"
	"atelier.example/lane/core/services"
)

// Factory builds a bound value on demand.
type Factory func() any

// Container holds the bindings for one run of the application.
type Container struct {
	calculator contracts.InvoiceCalculator
	factories  map[string]Factory
}

// BindDefault binds the standard calculator.
func BindDefault() *Container {
	return newContainer(services.NewStandardInvoiceCalculator())
}

// BindRush binds the rush calculator instead. Both bindings are chosen at
// RUNTIME, so the concrete type behind InvoiceCalculator() is not textual.
func BindRush() *Container {
	return newContainer(services.NewRushInvoiceCalculator())
}

func newContainer(calculator contracts.InvoiceCalculator) *Container {
	container := &Container{calculator: calculator, factories: map[string]Factory{}}
	container.Bind("invoice.calculator", func() any { return calculator })
	container.Bind("formatter.currency", func() any { return "EUR" })
	return container
}

// InvoiceCalculator returns whichever calculator this container was built with.
func (c *Container) InvoiceCalculator() contracts.InvoiceCalculator {
	return c.calculator
}

// Bind registers a factory under a string key.
func (c *Container) Bind(key string, factory Factory) {
	c.factories[key] = factory
}

// Make resolves a string key to a built value.
func (c *Container) Make(key string) (any, bool) {
	factory, found := c.factories[key]
	if !found {
		return nil, false
	}
	return factory(), true
}

// BoundKeys lists the bindings, SORTED: Go randomises map iteration, so an
// unsorted listing would make every expected output flaky.
func (c *Container) BoundKeys() []string {
	keys := make([]string, 0, len(c.factories))
	for key := range c.factories {
		keys = append(keys, key)
	}
	sort.Strings(keys)
	return keys
}
