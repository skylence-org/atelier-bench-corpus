package concerns

import "fmt"

// HasTimestamps supplies a monotonic tick counter by promotion. It is a
// counter and not a clock, so every expected output stays deterministic.
type HasTimestamps struct {
	ticks int
}

// Touch advances the counter and returns the new value.
func (h *HasTimestamps) Touch() int {
	h.ticks++
	return h.ticks
}

// TouchedAt renders the current tick.
func (h *HasTimestamps) TouchedAt() string {
	return fmt.Sprintf("tick-%d", h.ticks)
}
