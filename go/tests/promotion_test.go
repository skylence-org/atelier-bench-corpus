package tests

import (
	"testing"

	"atelier.example/lane/atelier/dataset"
	"atelier.example/lane/atelier/reports"
	"atelier.example/lane/core/models"
	"atelier.example/lane/core/support"
)

// seeded is the shared fixture for the whole test package.
func seeded() *dataset.Dataset {
	return dataset.Seeded()
}

func TestOneLevelPromotion(t *testing.T) {
	technician := models.NewTechnician(7, "Nel")
	// NextSlot and BookSlot come from the embedded *support.Schedule.
	if technician.NextSlot() != 0 {
		t.Errorf("next slot = %d, want 0", technician.NextSlot())
	}
	if !technician.BookSlot(0) {
		t.Error("booking slot 0 should succeed")
	}
	if technician.BookedCount() != 1 {
		t.Errorf("booked = %d, want 1", technician.BookedCount())
	}
}

func TestTwoLevelPromotion(t *testing.T) {
	technician := models.NewTechnician(7, "Nel")
	// Reference comes from HasReference, embedded in Staff, embedded here.
	if got := technician.Reference(); got != "TE-2026-000007" {
		t.Errorf("reference = %s, want TE-2026-000007", got)
	}
	if got := technician.ShortReference(); got != "TE7" {
		t.Errorf("short reference = %s, want TE7", got)
	}
	if got := technician.Staff.Reference(); got != "TE-2026-000007" {
		t.Errorf("explicit path = %s", got)
	}
}

func TestFourLevelPromotionOnAReport(t *testing.T) {
	report, found := reports.BySlug("cash-flow")
	if !found {
		t.Fatal("cash-flow report missing from the registry")
	}
	// Slug arrives through CompositeReport -> PeriodicReport -> BaseReport ->
	// Component, and none of those names appears in cash_flow.go.
	if report.Slug() != "cash-flow" || report.Title() != "Cash flow" {
		t.Errorf("slug/title = %s/%s", report.Slug(), report.Title())
	}
	cacheable, ok := report.(interface{ CacheKey() string })
	if !ok {
		t.Fatal("cash-flow should satisfy the cacheable shape")
	}
	if cacheable.CacheKey() != "cash-flow:cache" {
		t.Errorf("cache key = %s", cacheable.CacheKey())
	}
}

func TestMethodValueAndMethodExpression(t *testing.T) {
	schedule := support.NewSchedule()
	if !schedule.BookFirstFree() {
		t.Error("method value should book the first free slot")
	}
	if booked := support.BookAll(schedule, []int{1, 2, 3}); booked != 3 {
		t.Errorf("method expression booked %d, want 3", booked)
	}
	if schedule.BookedCount() != 4 {
		t.Errorf("booked = %d, want 4", schedule.BookedCount())
	}
}

func TestPointerAndValueReceivers(t *testing.T) {
	// Money has value receivers: the original is never mutated.
	amount := seeded().Orders[0].PartsSubtotal()
	doubled := amount.Times(2)
	if amount.Cents() != 19900 || doubled.Cents() != 39800 {
		t.Errorf("value receiver mutated the original: %d / %d", amount.Cents(), doubled.Cents())
	}
	// RepairOrder has pointer receivers: the mutation sticks.
	order := models.SeedRepairOrder(9, 1, 1)
	if !order.TransitionTo(support.StatusDiagnosing, "tester") {
		t.Fatal("transition should be allowed")
	}
	if order.Status != support.StatusDiagnosing {
		t.Errorf("status = %v, want diagnosing", order.Status)
	}
}
