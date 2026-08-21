// Package models is the domain: the structs the whole corpus asks questions
// about. Mutable models use POINTER receivers; value objects use value ones.
package models

import (
	"fmt"
	"strings"

	"atelier.example/lane/core/concerns"
	"atelier.example/lane/core/support"
)

// Customer EMBEDS concerns.HasReference: Reference() and ShortReference() are
// promoted onto Customer even though neither name appears in this file again.
type Customer struct {
	concerns.HasReference
	ID    int
	Name  string
	Email string
	Phone string
}

// SeedCustomer is the frozen-seed constructor: it fills the embedded reference
// state, which is what makes customer.Reference() answer "CU-2026-000001".
func SeedCustomer(id int, name string, email string, phone string) *Customer {
	return &Customer{
		HasReference: concerns.NewHasReference(support.CustomerPrefix, id),
		ID:           id,
		Name:         name,
		Email:        email,
		Phone:        phone,
	}
}

// IsReachable is true when a phone number was recorded.
func (c *Customer) IsReachable() bool {
	return strings.TrimSpace(c.Phone) != ""
}

// DisplayName is the name plus the masked mail domain.
func (c *Customer) DisplayName() string {
	_, domain, found := strings.Cut(c.Email, "@")
	if !found {
		return c.Name
	}
	return fmt.Sprintf("%s <%s>", c.Name, domain)
}
