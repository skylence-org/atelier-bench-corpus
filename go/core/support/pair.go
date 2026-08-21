package support

import "fmt"

// Pair is a GENERIC STRUCT with two type parameters. Its methods may not
// introduce type parameters of their own, so the transformation helper below
// is a free function instead.
type Pair[L any, R any] struct {
	Left  L
	Right R
}

// NewPair is the constructor; both parameters are inferred at the call site.
func NewPair[L any, R any](left L, right R) Pair[L, R] {
	return Pair[L, R]{Left: left, Right: right}
}

// Swap flips the halves. The receiver is generic; the method is not.
func (p Pair[L, R]) Swap() Pair[R, L] {
	return Pair[R, L]{Left: p.Right, Right: p.Left}
}

// String makes every instantiation a fmt.Stringer.
func (p Pair[L, R]) String() string {
	return fmt.Sprintf("(%v, %v)", p.Left, p.Right)
}

// MapRight rewrites the right half. A METHOD cannot add a type parameter, so
// this free function carries the third one.
func MapRight[L any, R any, T any](pair Pair[L, R], convert func(R) T) Pair[L, T] {
	return Pair[L, T]{Left: pair.Left, Right: convert(pair.Right)}
}
