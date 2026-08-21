//go:build darwin

package audit

// platformLabel is the darwin half of a BUILD-TAG PAIR: exactly one of the
// two files below compiles, and which one depends on GOOS, not on the source.
func platformLabel() string {
	return "darwin"
}
