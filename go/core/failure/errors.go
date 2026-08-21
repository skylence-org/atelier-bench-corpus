// Package failure carries the lane's error vocabulary: sentinel values, two
// wrapping error types and the helpers that read them back out.
package failure

import (
	"errors"
	"fmt"
)

// ErrNotFound is a SENTINEL: compared with errors.Is, never by string.
var ErrNotFound = errors.New("not found")

// ErrIllegalTransition is the second sentinel, wrapped by TransitionError.
var ErrIllegalTransition = errors.New("illegal transition")

// NotFoundError names the missing thing and WRAPS ErrNotFound, so
// errors.Is(err, ErrNotFound) is true for every one of them.
type NotFoundError struct {
	Resource string
	Key      string
}

// Error renders "repair order AT-2026-999999 not found".
func (e *NotFoundError) Error() string {
	return fmt.Sprintf("%s %s not found", e.Resource, e.Key)
}

// Unwrap is what makes errors.Is reach the sentinel.
func (e *NotFoundError) Unwrap() error {
	return ErrNotFound
}

// TransitionError reports a refused lifecycle move.
type TransitionError struct {
	From string
	To   string
}

// Error renders "cannot move from received to collected".
func (e *TransitionError) Error() string {
	return fmt.Sprintf("cannot move from %s to %s", e.From, e.To)
}

// Unwrap points at the second sentinel.
func (e *TransitionError) Unwrap() error {
	return ErrIllegalTransition
}

// NewNotFound builds the wrapping error every repository returns.
func NewNotFound(resource string, key string) error {
	return &NotFoundError{Resource: resource, Key: key}
}

// NewTransition builds the refused-move error.
func NewTransition(from string, to string) error {
	return &TransitionError{From: from, To: to}
}

// IsNotFound is errors.Is against the sentinel: it sees through any depth of
// fmt.Errorf("%w") wrapping.
func IsNotFound(err error) bool {
	return errors.Is(err, ErrNotFound)
}

// MissingKey is errors.As against the concrete type: it recovers the Key field
// that errors.Is cannot reach.
func MissingKey(err error) (string, bool) {
	var missing *NotFoundError
	if errors.As(err, &missing) {
		return missing.Key, true
	}
	return "", false
}

// Annotate adds context and keeps the chain intact with the %w verb.
func Annotate(context string, err error) error {
	if err == nil {
		return nil
	}
	return fmt.Errorf("%s: %w", context, err)
}
