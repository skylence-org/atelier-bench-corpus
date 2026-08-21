// Package notifiers carries the 8 notifiers. Each embeds support.BaseNotifier
// (Channel), declares only Notify, and registers itself in an init function.
package notifiers

import (
	"fmt"

	"atelier.example/lane/atelier/contracts"
	"atelier.example/lane/atelier/support"
)

// Compile-time proof of satisfaction.
var _ contracts.NotifierContract = (*DiscordNotifier)(nil)

// DiscordNotifier delivers on the discord channel.
type DiscordNotifier struct {
	support.BaseNotifier
	Endpoint string
	Limit    int
}

// NewDiscordNotifier builds the notifier with its default endpoint.
func NewDiscordNotifier() *DiscordNotifier {
	return &DiscordNotifier{BaseNotifier: support.NewBaseNotifier("discord"), Endpoint: "https://discord.test/hook", Limit: 2000}
}

// Notify truncates the message to the channel limit and renders the delivery.
func (n *DiscordNotifier) Notify(message string) string {
	if len(message) > n.Limit {
		message = message[:n.Limit]
	}
	return fmt.Sprintf("%s:%s", n.Channel(), message)
}

// init registers this notifier under its channel.
func init() {
	Register(NewDiscordNotifier())
}
