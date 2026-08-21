//go:build !darwin

package audit

// platformLabel is the non-darwin half of the build-tag pair; this is the one
// CI compiles, and platform_darwin.go is the one a local macOS build takes.
func platformLabel() string {
	return "portable"
}
