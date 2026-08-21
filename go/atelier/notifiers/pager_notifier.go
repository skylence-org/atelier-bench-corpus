// Package notifiers carries the 8 notifiers. Each embeds support.BaseNotifier
// (Channel), declares only Notify, and registers itself in an init function.
package notifiers

import (
	"fmt"

	"atelier.example/lane/atelier/contracts"
	"atelier.example/lane/atelier/support"
)

// Compile-time proof of satisfaction.
var _ contracts.NotifierContract = (*PagerNotifier)(nil)

// PagerNotifier delivers on the pager channel.
type PagerNotifier struct {
	support.BaseNotifier
	Endpoint string
	Limit    int
}

// NewPagerNotifier builds the notifier with its default endpoint.
func NewPagerNotifier() *PagerNotifier {
	return &PagerNotifier{BaseNotifier: support.NewBaseNotifier("pager"), Endpoint: "https://pager.test/v2", Limit: 512}
}

// Notify truncates the message to the channel limit and renders the delivery.
func (n *PagerNotifier) Notify(message string) string {
	if len(message) > n.Limit {
		message = message[:n.Limit]
	}
	return fmt.Sprintf("%s:%s", n.Channel(), message)
}

// init registers this notifier under its channel.
func init() {
	Register(NewPagerNotifier())
}
