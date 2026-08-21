package contracts

// NotifierContract is what all 8 notifiers satisfy.
type NotifierContract interface {
	Channel() string
	Notify(message string) string
}
