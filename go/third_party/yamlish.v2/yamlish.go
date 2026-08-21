// Package yamlish is a tiny in-tree module whose IMPORT PATH ends in
// "yamlish.v2" while its declared package name is "yamlish" -- the same shape
// as gopkg.in/yaml.v2. Code that imports it writes yamlish.Marshal, not
// yamlish.v2.Marshal, so anything deriving the local name from the last path
// segment gets it wrong.
//
// It lives under a `replace` directive in the lane's go.mod, so no network
// access is needed to build the lane.
package yamlish

import (
	"fmt"
	"sort"
	"strings"
)

// Version is the module version this package pretends to be.
const Version = "v2"

// Marshal renders a string map as sorted YAML-ish lines.
func Marshal(values map[string]string) string {
	keys := make([]string, 0, len(values))
	for key := range values {
		keys = append(keys, key)
	}
	sort.Strings(keys)
	lines := make([]string, 0, len(keys))
	for _, key := range keys {
		lines = append(lines, fmt.Sprintf("%s: %s", key, values[key]))
	}
	return strings.Join(lines, "\n")
}

// Unmarshal reads back what Marshal wrote.
func Unmarshal(raw string) map[string]string {
	values := map[string]string{}
	for _, line := range strings.Split(raw, "\n") {
		key, value, found := strings.Cut(line, ": ")
		if found {
			values[key] = value
		}
	}
	return values
}
