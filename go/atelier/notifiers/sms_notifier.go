// Package notifiers carries the 8 notifiers. Each embeds support.BaseNotifier
// (Channel), declares only Notify, and registers itself in an init function.
package notifiers

import (
	"fmt"

	"atelier.example/lane/atelier/contracts"
	"atelier.example/lane/atelier/support"
)

// Compile-time proof of satisfaction.
var _ contracts.NotifierContract = (*SmsNotifier)(nil)

// SmsNotifier delivers on the sms channel.
type SmsNotifier struct {
	support.BaseNotifier
	Endpoint string
	Limit    int
}

// NewSmsNotifier builds the notifier with its default endpoint.
func NewSmsNotifier() *SmsNotifier {
	return &SmsNotifier{BaseNotifier: support.NewBaseNotifier("sms"), Endpoint: "https://sms.test/send", Limit: 160}
}

// Notify truncates the message to the channel limit and renders the delivery.
func (n *SmsNotifier) Notify(message string) string {
	if len(message) > n.Limit {
		message = message[:n.Limit]
	}
	return fmt.Sprintf("%s:%s", n.Channel(), message)
}

// init registers this notifier under its channel.
func init() {
	Register(NewSmsNotifier())
}
