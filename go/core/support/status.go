package support

//go:generate go run atelier.example/lane/tools/statusgen -out status_labels_gen.go

// RepairStatus is the second IOTA ENUM: the lifecycle state of a repair order.
type RepairStatus int

// The lifecycle, in order. StatusReceived is the zero value.
const (
	StatusReceived RepairStatus = iota
	StatusDiagnosing
	StatusAwaitingParts
	StatusRepairing
	StatusCompleted
	StatusCollected
)

// statusTransitions is the whole state machine: which statuses may follow which.
var statusTransitions = map[RepairStatus][]RepairStatus{
	StatusReceived:      {StatusDiagnosing},
	StatusDiagnosing:    {StatusAwaitingParts, StatusRepairing},
	StatusAwaitingParts: {StatusRepairing},
	StatusRepairing:     {StatusCompleted},
	StatusCompleted:     {StatusCollected},
	StatusCollected:     {},
}

var statusWireValues = map[RepairStatus]string{
	StatusReceived:      "received",
	StatusDiagnosing:    "diagnosing",
	StatusAwaitingParts: "awaiting_parts",
	StatusRepairing:     "repairing",
	StatusCompleted:     "completed",
	StatusCollected:     "collected",
}

// TransitionsTo lists the statuses reachable in one step.
func (s RepairStatus) TransitionsTo() []RepairStatus {
	return statusTransitions[s]
}

// CanTransitionTo reports whether one step from s reaches next.
func (s RepairStatus) CanTransitionTo(next RepairStatus) bool {
	for _, candidate := range s.TransitionsTo() {
		if candidate == next {
			return true
		}
	}
	return false
}

// IsOpen reports whether the order is still in the workshop.
func (s RepairStatus) IsOpen() bool {
	return s != StatusCompleted && s != StatusCollected
}

// String is the wire value; Label (generated) is the human-facing one.
func (s RepairStatus) String() string {
	return statusWireValues[s]
}
