package tests

import (
	"testing"

	"atelier.example/lane/atelier/dataset"
	"atelier.example/lane/core/container"
)

func TestSeedNumbersAreFrozen(t *testing.T) {
	data := dataset.Seeded()
	if got := data.RevenueCents(); got != 58325 {
		t.Errorf("revenue = %d, want 58325", got)
	}
	if got := data.PartsCostCents(); got != 46300 {
		t.Errorf("parts cost = %d, want 46300", got)
	}
	if got := data.GrossProfitCents(); got != 12025 {
		t.Errorf("gross profit = %d, want 12025", got)
	}
	if got := len(data.Customers); got != 3 {
		t.Errorf("customers = %d, want 3", got)
	}
	if got := len(data.Orders); got != 4 {
		t.Errorf("orders = %d, want 4", got)
	}
	if got := len(data.Parts); got != 4 {
		t.Errorf("parts = %d, want 4", got)
	}
}

func TestTotalsThroughBothBindings(t *testing.T) {
	data := dataset.Seeded()
	standard := container.BindDefault().InvoiceCalculator()
	rush := container.BindRush().InvoiceCalculator()
	if got := data.Orders[0].Total(standard).String(); got != "349.00" {
		t.Errorf("order 1 standard total = %s, want 349.00", got)
	}
	if got := data.Orders[1].Total(rush).String(); got != "292.81" {
		t.Errorf("order 2 rush total = %s, want 292.81", got)
	}
	if got := data.Orders[1].Total(standard).String(); got != "234.25" {
		t.Errorf("order 2 standard total = %s, want 234.25", got)
	}
}

func TestPromotedReferenceReachesTwoLevels(t *testing.T) {
	data := dataset.Seeded()
	if got := data.Orders[0].Reference(); got != "AT-2026-000001" {
		t.Errorf("order reference = %s, want AT-2026-000001", got)
	}
	if got := data.Customers[0].Reference(); got != "CU-2026-000001" {
		t.Errorf("customer reference = %s, want CU-2026-000001", got)
	}
	if got := data.Technicians[0].Reference(); got != "TE-2026-000001" {
		t.Errorf("technician reference = %s, want TE-2026-000001", got)
	}
}
