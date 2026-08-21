// Package notifiers carries the 8 notifiers. Each embeds support.BaseNotifier
// (Channel), declares only Notify, and registers itself in an init function.
package notifiers

import (
	"fmt"

	"atelier.example/lane/atelier/contracts"
	"atelier.example/lane/atelier/support"
)

// Compile-time proof of satisfaction.
var _ contracts.NotifierContract = (*SlackNotifier)(nil)

// SlackNotifier delivers on the slack channel.
type SlackNotifier struct {
	support.BaseNotifier
	Endpoint string
	Limit    int
}

// NewSlackNotifier builds the notifier with its default endpoint.
func NewSlackNotifier() *SlackNotifier {
	return &SlackNotifier{BaseNotifier: support.NewBaseNotifier("slack"), Endpoint: "https://slack.test/hook", Limit: 3000}
}

// Notify truncates the message to the channel limit and renders the delivery.
func (n *SlackNotifier) Notify(message string) string {
	if len(message) > n.Limit {
		message = message[:n.Limit]
	}
	return fmt.Sprintf("%s:%s", n.Channel(), message)
}

// init registers this notifier under its channel.
func init() {
	Register(NewSlackNotifier())
}
