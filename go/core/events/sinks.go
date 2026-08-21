package events

import "sort"

// Sink is the driver-style extension point: a package registers one in its
// own init function, and the importer only ever names that package with a
// BLANK IMPORT, for the side effect.
type Sink interface {
	Name() string
	Accept(event string, payload Payload) bool
}

var sinks = map[string]Sink{}

// RegisterSink adds a sink under its name. Registering twice overwrites.
func RegisterSink(sink Sink) {
	sinks[sink.Name()] = sink
}

// SinkNames lists the registered sinks, sorted.
func SinkNames() []string {
	names := make([]string, 0, len(sinks))
	for name := range sinks {
		names = append(names, name)
	}
	sort.Strings(names)
	return names
}

// FanOut offers one event to every registered sink and counts the takers.
func FanOut(event string, payload Payload) int {
	accepted := 0
	for _, name := range SinkNames() {
		if sinks[name].Accept(event, payload) {
			accepted++
		}
	}
	return accepted
}
