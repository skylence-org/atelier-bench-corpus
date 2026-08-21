package support

import "sort"

// Registry is the GENERIC container every registry in the lane instantiates:
// reports keep a Registry[contracts.ReportContract], metrics their own, rules
// theirs. One type parameter, no constraint beyond any.
type Registry[T any] struct {
	entries map[string]T
}

// NewRegistry builds an empty registry of T.
func NewRegistry[T any]() *Registry[T] {
	return &Registry[T]{entries: map[string]T{}}
}

// Add registers one entry under its key, overwriting a duplicate.
func (r *Registry[T]) Add(key string, value T) {
	r.entries[key] = value
}

// Get resolves one key.
func (r *Registry[T]) Get(key string) (T, bool) {
	value, found := r.entries[key]
	return value, found
}

// Len is the number of registered entries.
func (r *Registry[T]) Len() int {
	return len(r.entries)
}

// Keys lists the keys SORTED, so registry output never depends on Go's
// randomised map iteration order.
func (r *Registry[T]) Keys() []string {
	keys := make([]string, 0, len(r.entries))
	for key := range r.entries {
		keys = append(keys, key)
	}
	sort.Strings(keys)
	return keys
}

// All returns every entry in sorted-key order.
func (r *Registry[T]) All() []T {
	values := make([]T, 0, len(r.entries))
	for _, key := range r.Keys() {
		values = append(values, r.entries[key])
	}
	return values
}
