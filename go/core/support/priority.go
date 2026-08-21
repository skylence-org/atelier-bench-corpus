// Package support carries the value types the whole lane shares: the two
// iota enums, the reference helpers, the generic containers and the schedule.
package support

// Priority is an IOTA ENUM: the constants below are untyped ordinals with a
// named type, not strings, so the wire value comes from a table and not from
// the identifier.
type Priority int

// The three priorities, in billing order. PriorityStandard is the zero value,
// so a freshly allocated RepairOrder is standard-priced without an explicit
// assignment.
const (
	PriorityStandard Priority = iota // the zero value: a fresh order is standard-priced
	PriorityRush                     // billed with the surcharge from the table below
	PriorityWarranty                 // never billed
)

// Package-level var block: the surcharge table and the label table are data,
// not code, and both are keyed by the enum.
var (
	surchargeBasisPoints = map[Priority]int64{
		PriorityStandard: 0,
		PriorityRush:     2500,
		PriorityWarranty: 0,
	}

	priorityWireValues = map[Priority]string{
		PriorityStandard: "standard",
		PriorityRush:     "rush",
		PriorityWarranty: "warranty",
	}

	priorityLabels = map[Priority]string{
		PriorityStandard: "Standard",
		PriorityRush:     "Rush",
		PriorityWarranty: "Warranty",
	}
)

// SurchargeBp is the basis-point surcharge added on top of the standard price.
func (p Priority) SurchargeBp() int64 {
	return surchargeBasisPoints[p]
}

// Label is the human-facing name.
func (p Priority) Label() string {
	return priorityLabels[p]
}

// IsExpedited reports whether the order jumps the queue.
func (p Priority) IsExpedited() bool {
	return p == PriorityRush
}

// IsBillable reports whether a surcharge may be applied at all.
func (p Priority) IsBillable() bool {
	return p != PriorityWarranty
}

// String is the wire value, which is NOT the constant identifier.
func (p Priority) String() string {
	return priorityWireValues[p]
}

// ParsePriority maps a wire value back to its constant.
func ParsePriority(raw string) (Priority, bool) {
	for priority, wire := range priorityWireValues {
		if wire == raw {
			return priority, true
		}
	}
	return PriorityStandard, false
}
