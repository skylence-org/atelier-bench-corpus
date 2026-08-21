// Package audit is an INTERNAL package: the import path contains /internal/,
// so only code inside atelier.example/lane may import it. It registers an
// event sink in its init function, which is why callers blank-import it.
package audit

import (
	_ "embed"
	"fmt"
	"strings"

	"atelier.example/lane/core/events"
)

// banner is EMBEDDED at build time from the file next to this one; the
// contents are in the binary, and no file is read at run time.
//
//go:embed banner.txt
var banner string

// Sink writes accepted events to an in-memory trail.
type Sink struct {
	trail []string
}

// Name identifies the sink in the registry.
func (s *Sink) Name() string {
	return "audit"
}

// Accept records every event and always takes it.
func (s *Sink) Accept(event string, payload events.Payload) bool {
	s.trail = append(s.trail, fmt.Sprintf("%s/%s", platformLabel(), event))
	return true
}

// Trail is what the sink recorded.
func (s *Sink) Trail() []string {
	return s.trail
}

// Banner is the embedded text, trimmed.
func Banner() string {
	return strings.TrimSpace(banner)
}

// init is the whole point of the blank import: importing this package for its
// side effect registers the sink with no call site anywhere.
func init() {
	events.RegisterSink(&Sink{})
}
