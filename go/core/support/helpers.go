package support

import "strings"

// Number is a TYPE CONSTRAINT with a union of approximated types: any named
// type whose underlying type is one of these satisfies it.
type Number interface {
	~int | ~int64 | ~float64
}

// Keyed is the constraint the registry helpers use: comparable keys only.
type Keyed interface {
	comparable
}

// SumOf adds up any slice of numbers. One type parameter, one constraint.
func SumOf[T Number](values []T) T {
	var total T
	for _, value := range values {
		total += value
	}
	return total
}

// MapSlice converts a slice element by element. TWO type parameters, both inferred.
func MapSlice[T any, R any](values []T, convert func(T) R) []R {
	converted := make([]R, 0, len(values))
	for _, value := range values {
		converted = append(converted, convert(value))
	}
	return converted
}

// FilterSlice keeps the elements the predicate accepts.
func FilterSlice[T any](values []T, keep func(T) bool) []T {
	kept := make([]T, 0, len(values))
	for _, value := range values {
		if keep(value) {
			kept = append(kept, value)
		}
	}
	return kept
}

// KeysOf returns the map keys; callers sort them, because Go randomises map order.
func KeysOf[K Keyed, V any](values map[K]V) []K {
	keys := make([]K, 0, len(values))
	for key := range values {
		keys = append(keys, key)
	}
	return keys
}

// Slugify lowercases and hyphenates a title.
func Slugify(title string) string {
	return strings.ReplaceAll(strings.ToLower(strings.TrimSpace(title)), " ", "-")
}
