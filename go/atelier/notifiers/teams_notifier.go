// Package notifiers carries the 8 notifiers. Each embeds support.BaseNotifier
// (Channel), declares only Notify, and registers itself in an init function.
package notifiers

import (
	"fmt"

	"atelier.example/lane/atelier/contracts"
	"atelier.example/lane/atelier/support"
)

// Compile-time proof of satisfaction.
var _ contracts.NotifierContract = (*TeamsNotifier)(nil)

// TeamsNotifier delivers on the teams channel.
type TeamsNotifier struct {
	support.BaseNotifier
	Endpoint string
	Limit    int
}

// NewTeamsNotifier builds the notifier with its default endpoint.
func NewTeamsNotifier() *TeamsNotifier {
	return &TeamsNotifier{BaseNotifier: support.NewBaseNotifier("teams"), Endpoint: "https://teams.test/hook", Limit: 4096}
}

// Notify truncates the message to the channel limit and renders the delivery.
func (n *TeamsNotifier) Notify(message string) string {
	if len(message) > n.Limit {
		message = message[:n.Limit]
	}
	return fmt.Sprintf("%s:%s", n.Channel(), message)
}

// init registers this notifier under its channel.
func init() {
	Register(NewTeamsNotifier())
}
