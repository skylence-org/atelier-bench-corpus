package concerns

import "fmt"

// HasLogging supplies a tiny in-memory log by promotion.
type HasLogging struct {
	lines []string
}

// Log appends one line.
func (h *HasLogging) Log(message string) {
	h.lines = append(h.lines, message)
}

// Logged returns every logged line.
func (h *HasLogging) Logged() []string {
	return h.lines
}

// LogCount is how many lines were logged.
func (h *HasLogging) LogCount() int {
	return len(h.lines)
}

// Describe renders the log size.
func (h *HasLogging) Describe() string {
	return fmt.Sprintf("%d line(s)", len(h.lines))
}
