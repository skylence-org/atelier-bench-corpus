package support

// BaseNotifier is the notifier-side base.
type BaseNotifier struct {
	channel string
}

// NewBaseNotifier seeds the base.
func NewBaseNotifier(channel string) BaseNotifier {
	return BaseNotifier{channel: channel}
}

// Channel is promoted onto all 8 notifiers.
func (n BaseNotifier) Channel() string {
	return n.channel
}
