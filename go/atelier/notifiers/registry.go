package notifiers

import (
	"atelier.example/lane/atelier/contracts"
	"atelier.example/lane/atelier/support"
)

// registry maps a channel name to its notifier.
var registry = support.NewRegistry[contracts.NotifierContract]()

// Register adds one notifier under its channel.
func Register(notifier contracts.NotifierContract) {
	registry.Add(notifier.Channel(), notifier)
}

// ByChannel resolves a notifier from its channel name.
func ByChannel(channel string) (contracts.NotifierContract, bool) {
	return registry.Get(channel)
}

// Channels lists the registered channels, sorted.
func Channels() []string {
	return registry.Keys()
}

// All returns every notifier, sorted by channel.
func All() []contracts.NotifierContract {
	return registry.All()
}

// Count is how many notifiers registered themselves.
func Count() int {
	return registry.Len()
}
