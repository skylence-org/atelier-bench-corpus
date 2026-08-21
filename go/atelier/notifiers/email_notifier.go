// Package notifiers carries the 8 notifiers. Each embeds support.BaseNotifier
// (Channel), declares only Notify, and registers itself in an init function.
package notifiers

import (
	"fmt"

	"atelier.example/lane/atelier/contracts"
	"atelier.example/lane/atelier/support"
)

// Compile-time proof of satisfaction.
var _ contracts.NotifierContract = (*EmailNotifier)(nil)

// EmailNotifier delivers on the email channel.
type EmailNotifier struct {
	support.BaseNotifier
	Endpoint string
	Limit    int
}

// NewEmailNotifier builds the notifier with its default endpoint.
func NewEmailNotifier() *EmailNotifier {
	return &EmailNotifier{BaseNotifier: support.NewBaseNotifier("email"), Endpoint: "smtp://mail.test:25", Limit: 65536}
}

// Notify truncates the message to the channel limit and renders the delivery.
func (n *EmailNotifier) Notify(message string) string {
	if len(message) > n.Limit {
		message = message[:n.Limit]
	}
	return fmt.Sprintf("%s:%s", n.Channel(), message)
}

// init registers this notifier under its channel.
func init() {
	Register(NewEmailNotifier())
}
