package tests

import (
	"errors"
	"testing"

	"atelier.example/lane/core/failure"
	"atelier.example/lane/core/support"
)

func TestWrappedErrorsAreRecognisedThroughAnyDepth(t *testing.T) {
	base := failure.NewNotFound("repair order", "AT-2026-999999")
	wrapped := failure.Annotate("handler", failure.Annotate("repository", base))

	if !errors.Is(wrapped, failure.ErrNotFound) {
		t.Error("errors.Is should see the sentinel through two wrappings")
	}
	if !failure.IsNotFound(wrapped) {
		t.Error("IsNotFound should agree")
	}
	key, found := failure.MissingKey(wrapped)
	if !found || key != "AT-2026-999999" {
		t.Errorf("errors.As recovered %q / %v", key, found)
	}
	var missing *failure.NotFoundError
	if !errors.As(wrapped, &missing) || missing.Resource != "repair order" {
		t.Errorf("errors.As target = %+v", missing)
	}
}

func TestTransitionErrorWrapsItsOwnSentinel(t *testing.T) {
	err := failure.NewTransition(support.StatusReceived.String(), support.StatusCollected.String())
	if !errors.Is(err, failure.ErrIllegalTransition) {
		t.Error("transition error should wrap ErrIllegalTransition")
	}
	if errors.Is(err, failure.ErrNotFound) {
		t.Error("transition error must not look like a not-found")
	}
	if err.Error() != "cannot move from received to collected" {
		t.Errorf("message = %s", err.Error())
	}
}

func TestAnnotateKeepsNilNil(t *testing.T) {
	if failure.Annotate("context", nil) != nil {
		t.Error("annotating nil must stay nil")
	}
}
