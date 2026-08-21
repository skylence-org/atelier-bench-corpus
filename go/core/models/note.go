package models

import "strings"

// Note is a free-text remark attached to a repair order.
type Note struct {
	ID            int
	RepairOrderID int
	Body          string
	Author        string
}

// NewNote builds a note with its body trimmed.
func NewNote(id int, repairOrderID int, body string, author string) *Note {
	return &Note{ID: id, RepairOrderID: repairOrderID, Body: strings.TrimSpace(body), Author: author}
}

// IsEmpty is true when nothing was written.
func (n *Note) IsEmpty() bool {
	return n.Body == ""
}

// Excerpt is the first 40 characters.
func (n *Note) Excerpt() string {
	if len(n.Body) <= 40 {
		return n.Body
	}
	return n.Body[:40]
}
