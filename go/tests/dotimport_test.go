package tests

import (
	"testing"

	. "atelier.example/lane/core/support"
)

// This file DOT-IMPORTS core/support: FormatReference, ParseReference and
// Slugify are called with no package qualifier at all, so the call sites carry
// no textual link to the package that defines them.
func TestDotImportedHelpers(t *testing.T) {
	if got := FormatReference(AtelierPrefix, 42); got != "AT-2026-000042" {
		t.Errorf("FormatReference = %s", got)
	}
	parsed, ok := ParseReference("AT-2026-000042")
	if !ok || parsed.Prefix != "AT" || parsed.Year != 2026 || parsed.Number != 42 {
		t.Errorf("ParseReference = %+v / %v", parsed, ok)
	}
	if _, ok := ParseReference("nope"); ok {
		t.Error("a malformed reference must not parse")
	}
	if got := Slugify("Gross Profit"); got != "gross-profit" {
		t.Errorf("Slugify = %s", got)
	}
	if got := NextNumber(FirstNumber); got != 2 {
		t.Errorf("NextNumber = %d", got)
	}
}
