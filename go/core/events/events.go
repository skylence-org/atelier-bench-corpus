// Package events is the string-named event bus: listeners subscribe under a
// STRING constant, never under a type, so the edge from emit to handler only
// exists through the value of that string.
package events

import "sort"

// The event names. Everything dispatches through these constants.
const (
	RepairCompleted = "repair.completed"
	StockDepleted   = "stock.depleted"
	InvoiceSettled  = "invoice.settled"
)

// Payload is the untyped bag every listener receives.
type Payload map[string]string

// Listener is the handler side of the bus.
type Listener interface {
	Handle(payload Payload)
}

// ListenerFunc adapts a plain function to Listener.
type ListenerFunc func(payload Payload)

// Handle calls the function itself.
func (f ListenerFunc) Handle(payload Payload) {
	f(payload)
}

// Dispatcher routes events to the listeners registered for their name.
type Dispatcher struct {
	listeners map[string][]Listener
	Seen      []string
}

// NewDispatcher builds an empty bus.
func NewDispatcher() *Dispatcher {
	return &Dispatcher{listeners: map[string][]Listener{}}
}

// Listen subscribes a listener to one event name.
func (d *Dispatcher) Listen(event string, listener Listener) {
	d.listeners[event] = append(d.listeners[event], listener)
}

// Dispatch delivers the payload and reports whether anything handled it.
func (d *Dispatcher) Dispatch(event string, payload Payload) bool {
	d.Seen = append(d.Seen, event)
	listeners, found := d.listeners[event]
	if !found {
		return false
	}
	for _, listener := range listeners {
		listener.Handle(payload)
	}
	return len(listeners) > 0
}

// ListenerNames lists the subscribed event names, sorted.
func (d *Dispatcher) ListenerNames() []string {
	names := make([]string, 0, len(d.listeners))
	for name := range d.listeners {
		names = append(names, name)
	}
	sort.Strings(names)
	return names
}

// CompletionNotice is the concrete listener the app registers.
type CompletionNotice struct {
	Sent int
	Last string
}

// Handle records the reference it was told about.
func (n *CompletionNotice) Handle(payload Payload) {
	n.Sent++
	n.Last = payload["reference"]
}

// Subscribe wires this listener to the completion event and returns itself.
func (n *CompletionNotice) Subscribe(dispatcher *Dispatcher) *CompletionNotice {
	dispatcher.Listen(RepairCompleted, n)
	return n
}

// ChannelFor maps an event name to the notification channel it belongs on.
func ChannelFor(event string, payload Payload) string {
	switch event {
	case RepairCompleted:
		return "customer"
	case StockDepleted:
		return "inventory"
	case InvoiceSettled:
		return "finance"
	default:
		return "audit"
	}
}
