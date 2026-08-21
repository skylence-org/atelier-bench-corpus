package concerns

import "fmt"

// HasAudit supplies the AuditableContract method set. It keeps state, so
// embedders must embed it by VALUE and call through a pointer receiver.
type HasAudit struct {
	trail []string
}

// Record appends one audit line.
func (h *HasAudit) Record(action string) {
	h.trail = append(h.trail, fmt.Sprintf("audit:%s", action))
}

// AuditTrail returns every recorded line.
func (h *HasAudit) AuditTrail() []string {
	return h.trail
}
