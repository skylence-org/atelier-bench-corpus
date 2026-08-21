package tests

import (
	"testing"

	moneyfmt "atelier.example/lane/core/billing"
	"atelier.example/lane/core/money"
	statusfmt "atelier.example/lane/core/reporting"
	"atelier.example/lane/core/support"
)

func TestTheTwoFormattersAreUnrelated(t *testing.T) {
	// Both types are named Formatter. Only the import alias tells them apart.
	money := moneyfmt.NewFormatter("EUR")
	status := statusfmt.NewFormatter("en")
	if got := money.Money(moneyFromCents(34900)); got != "349.00 EUR" {
		t.Errorf("money = %s", got)
	}
	if got := status.StatusLine(support.StatusCompleted, "intake"); got != "Completed since intake" {
		t.Errorf("status = %s", got)
	}
	if got := status.StatusLine(support.StatusRepairing, ""); got != "Repairing" {
		t.Errorf("status without since = %s", got)
	}
	if got := money.Line(2, "Battery 55Wh", moneyFromCents(17800)); got != "2 x Battery 55Wh = 178.00 EUR" {
		t.Errorf("line = %s", got)
	}
}

func moneyFromCents(cents int64) money.Money {
	return money.FromCents(cents)
}
