// Package concerns holds the EMBEDDABLE structs. A model embeds one and its
// method set grows by promotion: no method is redeclared on the model, and
// nothing in the model file mentions the promoted method's name.
package concerns

import (
	"fmt"

	"atelier.example/lane/core/support"
)

// HasReference is the embedded reference behaviour. Embedding it promotes
// Reference() and ShortReference() one level up.
type HasReference struct {
	ReferencePrefix string
	ReferenceNumber int
}

// NewHasReference seeds the embedded state.
func NewHasReference(prefix string, number int) HasReference {
	return HasReference{ReferencePrefix: prefix, ReferenceNumber: number}
}

// Reference renders "AT-2026-000001"; it is promoted onto every embedder.
func (h HasReference) Reference() string {
	prefix := h.ReferencePrefix
	if prefix == "" {
		prefix = support.AtelierPrefix
	}
	return support.FormatReference(prefix, h.ReferenceNumber)
}

// ShortReference is the compact form, also promoted.
func (h HasReference) ShortReference() string {
	prefix := h.ReferencePrefix
	if prefix == "" {
		prefix = support.AtelierPrefix
	}
	return fmt.Sprintf("%s%d", prefix, h.ReferenceNumber)
}

// Referenced is the interface the promoted methods satisfy. Nothing declares
// that it implements this: the match is structural.
type Referenced interface {
	Reference() string
	ShortReference() string
}

// ReferenceOf reads the promoted method through the interface.
func ReferenceOf(model Referenced) string {
	return model.Reference()
}
