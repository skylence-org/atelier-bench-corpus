package tests

import (
	"testing"

	benchcontracts "atelier.example/lane/atelier/contracts"
	"atelier.example/lane/atelier/reports"
	"atelier.example/lane/atelier/repositories"
	corecontracts "atelier.example/lane/core/contracts"
	"atelier.example/lane/core/models"
	"atelier.example/lane/core/money"
	"atelier.example/lane/core/services"
	"atelier.example/lane/core/support"
)

func TestStructuralSatisfactionWithoutAnImplementsKeyword(t *testing.T) {
	var calculator corecontracts.InvoiceCalculator = services.NewStandardInvoiceCalculator()
	if calculator.Name() != "standard" || calculator.AppliesSurcharge() {
		t.Errorf("standard calculator = %s / %v", calculator.Name(), calculator.AppliesSurcharge())
	}
	// A plain function satisfies the same interface through a named func type.
	var adapted corecontracts.InvoiceCalculator = corecontracts.CalculatorFunc(func(order *models.RepairOrder) money.Money {
		return order.PartsSubtotal()
	})
	if adapted.Name() != "func" {
		t.Errorf("adapted name = %s", adapted.Name())
	}
	if got := adapted.Calculate(seeded().Orders[0]).Cents(); got != 19900 {
		t.Errorf("adapted calculate = %d, want 19900", got)
	}
}

func TestEveryReportSatisfiesTheContract(t *testing.T) {
	all := reports.All()
	if len(all) != 24 {
		t.Fatalf("reports = %d, want 24", len(all))
	}
	data := seeded()
	for _, report := range all {
		var contract benchcontracts.ReportContract = report
		if contract.Slug() == "" {
			t.Errorf("%T has an empty slug", report)
		}
		if contract.Rows(data) == nil {
			t.Errorf("%s returned nil rows", contract.Slug())
		}
	}
}

func TestGenericRepositoryInstantiations(t *testing.T) {
	data := seeded()
	customers := repositories.NewCustomerRepository(data.Customers)
	orders := repositories.NewOrderRepository(data.Orders)
	claims := repositories.NewWarrantyRepository([]repositories.Claim{{ID: 1, OrderID: 1}})
	if corecontracts.CountOf[*models.Customer](customers) != 3 {
		t.Errorf("customers = %d", customers.Count())
	}
	if corecontracts.CountOf[*models.RepairOrder](orders) != 4 {
		t.Errorf("orders = %d", orders.Count())
	}
	if corecontracts.CountOf[repositories.Claim](claims) != 1 {
		t.Errorf("claims = %d", claims.Count())
	}
	if _, found := orders.Find(99); found {
		t.Error("order 99 should not be found")
	}
}

func TestTypeSwitchAndAnonymousStruct(t *testing.T) {
	if got := support.DescribeChoice(support.LeftOf("body", "empty")); got != "left:body" {
		t.Errorf("left = %s", got)
	}
	if got := support.DescribeChoice(support.RightOf(7)); got != "right:7" {
		t.Errorf("right = %s", got)
	}
	summary := support.AnonymousSummary(support.LeftOf("", "fallback"))
	if summary.Kind != "left" || summary.Text != "fallback" {
		t.Errorf("anonymous summary = %+v", summary)
	}
}

func TestGenericsAcrossTheLane(t *testing.T) {
	pair := support.NewPair("orders", 4)
	if pair.String() != "(orders, 4)" {
		t.Errorf("pair = %s", pair.String())
	}
	if swapped := pair.Swap(); swapped.Left != 4 {
		t.Errorf("swapped = %v", swapped)
	}
	doubled := support.MapRight(pair, func(value int) int { return value * 2 })
	if doubled.Right != 8 {
		t.Errorf("mapped = %v", doubled)
	}
	if support.SumOf([]int64{1, 2, 3}) != 6 {
		t.Error("SumOf over int64 failed")
	}
	if support.SumOf([]float64{1.5, 2.5}) != 4 {
		t.Error("SumOf over float64 failed")
	}
	lengths := support.MapSlice([]string{"a", "bb"}, func(value string) int { return len(value) })
	if len(lengths) != 2 || lengths[1] != 2 {
		t.Errorf("MapSlice = %v", lengths)
	}
}
