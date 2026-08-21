package models

// Label is a printable sticker for a repair order.
type Label struct {
	ID            int
	RepairOrderID int
	Code          string
	Printed       bool
}

// NewLabel builds an unprinted label.
func NewLabel(id int, repairOrderID int, code string) *Label {
	return &Label{ID: id, RepairOrderID: repairOrderID, Code: code}
}

// Print marks the label printed and reports whether anything changed.
func (l *Label) Print() bool {
	if l.Printed {
		return false
	}
	l.Printed = true
	return true
}
