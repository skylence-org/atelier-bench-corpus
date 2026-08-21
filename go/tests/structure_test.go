package tests

import (
	"strings"
	"testing"

	"atelier.example/lane/atelier/services"
	"atelier.example/lane/core/money"
	"atelier.example/lane/core/policy"
	"atelier.example/lane/core/support"
	"atelier.example/lane/internal/audit"
)

func TestMoneyParsingAndArithmetic(t *testing.T) {
	parsed, err := money.Parse("12.34")
	if err != nil || parsed.Cents() != 1234 {
		t.Errorf("parse = %d / %v", parsed.Cents(), err)
	}
	if _, err := money.Parse("twelve"); err == nil {
		t.Error("malformed money must fail")
	}
	sum := money.Sum([]money.Money{money.FromCents(100), money.FromCents(250)})
	if sum.String() != "3.50" {
		t.Errorf("sum = %s", sum.String())
	}
	if money.FromCents(-150).String() != "-1.50" {
		t.Errorf("negative = %s", money.FromCents(-150).String())
	}
	if money.FromCents(23425).WithSurchargeBp(2500).Cents() != 29281 {
		t.Error("the rush surcharge must round half up on the cent")
	}
}

func TestPolicyDispatchesByStringAbility(t *testing.T) {
	data := seeded()
	gate := policy.NewRepairOrderPolicy()
	owner := policy.NewActor(1, "customer")
	if !gate.Allows("collect", owner, data.Orders[0]) {
		t.Error("the owner may collect a completed order")
	}
	if gate.Allows("collect", policy.NewActor(6, "technician"), data.Orders[0]) {
		t.Error("a stranger may not collect")
	}
	if gate.Allows("unknown", owner, data.Orders[0]) {
		t.Error("an unknown ability is denied")
	}
}

func TestTreeWalksWithClosures(t *testing.T) {
	root := support.NewTreeNode("orders")
	root.Add(support.NewTreeNode("open").Add(support.NewTreeNode("rush")))
	root.Add(support.NewTreeNode("completed"))
	if root.Depth() != 3 {
		t.Errorf("depth = %d, want 3", root.Depth())
	}
	if root.CountLabels() != 4 {
		t.Errorf("nodes = %d, want 4", root.CountLabels())
	}
	count := support.LabelCounter()
	count("rush")
	if count("rush") != 2 {
		t.Error("the closure should keep its own state")
	}
}

func TestServicesRunAndDispatchByScope(t *testing.T) {
	data := seeded()
	volume := services.NewOrderVolumeService()
	if volume.By(data, "open") != 3 || volume.By(data, "completed") != 1 {
		t.Errorf("scopes = %d / %d", volume.By(data, "open"), volume.By(data, "completed"))
	}
	if volume.By(data, "nope") != 0 {
		t.Error("an unknown scope resolves to nothing")
	}
	if rows := services.NewRevenueService().MetricSweep(data); len(rows) != 16 {
		t.Errorf("metric sweep = %d rows, want 16", len(rows))
	}
	if name := services.NewBacklogService().Name(); name != "backlog" {
		t.Errorf("promoted name = %s", name)
	}
}

func TestEmbeddedBannerIsCompiledIn(t *testing.T) {
	if !strings.Contains(audit.Banner(), "audit sink") {
		t.Errorf("embedded banner = %q", audit.Banner())
	}
}

func TestRangeOverFuncIterator(t *testing.T) {
	seen := 0
	for order := range seeded().Iterate() {
		if order.Reference() == "" {
			t.Error("iterated order without a reference")
		}
		seen++
	}
	if seen != 4 {
		t.Errorf("iterated %d orders, want 4", seen)
	}
	if depth := services.NewBacklogService().Depth(seeded()); depth != 3 {
		t.Errorf("backlog depth = %d, want 3", depth)
	}
}
