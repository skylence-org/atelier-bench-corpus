// Package notifiers carries the 8 notifiers. Each embeds support.BaseNotifier
// (Channel), declares only Notify, and registers itself in an init function.
package notifiers

import (
	"fmt"

	"atelier.example/lane/atelier/contracts"
	"atelier.example/lane/atelier/support"
)

// Compile-time proof of satisfaction.
var _ contracts.NotifierContract = (*WebhookNotifier)(nil)

// WebhookNotifier delivers on the webhook channel.
type WebhookNotifier struct {
	support.BaseNotifier
	Endpoint string
	Limit    int
}

// NewWebhookNotifier builds the notifier with its default endpoint.
func NewWebhookNotifier() *WebhookNotifier {
	return &WebhookNotifier{BaseNotifier: support.NewBaseNotifier("webhook"), Endpoint: "https://hooks.test/generic", Limit: 8192}
}

// Notify truncates the message to the channel limit and renders the delivery.
func (n *WebhookNotifier) Notify(message string) string {
	if len(message) > n.Limit {
		message = message[:n.Limit]
	}
	return fmt.Sprintf("%s:%s", n.Channel(), message)
}

// init registers this notifier under its channel.
func init() {
	Register(NewWebhookNotifier())
}
