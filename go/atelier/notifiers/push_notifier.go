// Package notifiers carries the 8 notifiers. Each embeds support.BaseNotifier
// (Channel), declares only Notify, and registers itself in an init function.
package notifiers

import (
	"fmt"

	"atelier.example/lane/atelier/contracts"
	"atelier.example/lane/atelier/support"
)

// Compile-time proof of satisfaction.
var _ contracts.NotifierContract = (*PushNotifier)(nil)

// PushNotifier delivers on the push channel.
type PushNotifier struct {
	support.BaseNotifier
	Endpoint string
	Limit    int
}

// NewPushNotifier builds the notifier with its default endpoint.
func NewPushNotifier() *PushNotifier {
	return &PushNotifier{BaseNotifier: support.NewBaseNotifier("push"), Endpoint: "https://push.test/send", Limit: 1024}
}

// Notify truncates the message to the channel limit and renders the delivery.
func (n *PushNotifier) Notify(message string) string {
	if len(message) > n.Limit {
		message = message[:n.Limit]
	}
	return fmt.Sprintf("%s:%s", n.Channel(), message)
}

// init registers this notifier under its channel.
func init() {
	Register(NewPushNotifier())
}
