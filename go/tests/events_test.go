package tests

import (
	"testing"

	"atelier.example/lane/core/events"
	_ "atelier.example/lane/internal/audit"
)

func TestStringNamedEventsReachTheirListener(t *testing.T) {
	dispatcher := events.NewDispatcher()
	notice := (&events.CompletionNotice{}).Subscribe(dispatcher)
	if !dispatcher.Dispatch(events.RepairCompleted, events.Payload{"reference": "AT-2026-000001"}) {
		t.Error("the completion event should be handled")
	}
	if dispatcher.Dispatch(events.StockDepleted, events.Payload{"sku": "SCR-13"}) {
		t.Error("nothing listens for stock.depleted")
	}
	if notice.Sent != 1 || notice.Last != "AT-2026-000001" {
		t.Errorf("listener state = %d / %s", notice.Sent, notice.Last)
	}
	if names := dispatcher.ListenerNames(); len(names) != 1 || names[0] != "repair.completed" {
		t.Errorf("listener names = %v", names)
	}
	if channel := events.ChannelFor(events.StockDepleted, nil); channel != "inventory" {
		t.Errorf("channel = %s", channel)
	}
}

func TestBlankImportRegistersTheAuditSink(t *testing.T) {
	// Nothing in this file calls into the audit package: the blank import at
	// the top is the only reason the sink exists.
	names := events.SinkNames()
	if len(names) != 1 || names[0] != "audit" {
		t.Fatalf("sink names = %v, want [audit]", names)
	}
	if accepted := events.FanOut(events.InvoiceSettled, events.Payload{"invoice": "1"}); accepted != 1 {
		t.Errorf("fan-out accepted %d, want 1", accepted)
	}
}
