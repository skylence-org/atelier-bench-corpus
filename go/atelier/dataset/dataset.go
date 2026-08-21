// Package dataset carries the frozen seed every lane reproduces: revenue
// 58325c, part cost 46300c, gross profit 12025c, 4 orders / 3 customers /
// 4 parts / 2 invoices. Changing a row here changes bench ground truth in
// five other lanes.
package dataset

import (
	"iter"

	"atelier.example/lane/core/models"
	"atelier.example/lane/core/money"
	"atelier.example/lane/core/support"
)

// Dataset is the in-memory database every report, metric and rule reads.
type Dataset struct {
	Customers   []*models.Customer
	Devices     []*models.Device
	Orders      []*models.RepairOrder
	Parts       []*models.Part
	Technicians []*models.Technician
	Invoices    []*models.Invoice
}

// Seeded builds the frozen dataset. Every number below is ground truth.
func Seeded() *Dataset {
	customers := []*models.Customer{
		models.SeedCustomer(1, "Ada Byron", "ada@example.test", "+32 470 00 00 01"),
		models.SeedCustomer(2, "Grace Hopper", "grace@example.test", ""),
		models.SeedCustomer(3, "Alan Turing", "alan@example.test", "+32 470 00 00 03"),
	}
	devices := []*models.Device{
		models.NewDevice(1, 1, "Framework", "13", "SER-0001"),
		models.NewDevice(2, 2, "Lenovo", "X1", "SER-0002"),
		models.NewDevice(3, 3, "Apple", "MBP 14", ""),
	}
	parts := []*models.Part{
		models.SeedPart(1, "SCR-13", "Screen 13\"", money.FromCents(19900), 4),
		models.SeedPart(2, "BAT-55", "Battery 55Wh", money.FromCents(8900), 1),
		models.SeedPart(3, "KBD-EU", "Keyboard EU", money.FromCents(6400), 7),
		models.SeedPart(4, "FAN-A1", "Cooling fan", money.FromCents(2200), 2),
	}
	technicians := []*models.Technician{
		models.NewTechnician(1, "Nel"),
		models.NewTechnician(2, "Rik"),
		models.NewTechnician(3, "Sam"),
	}
	orders := []*models.RepairOrder{
		models.SeedRepairOrder(1, 1, 1),
		models.SeedRepairOrder(2, 2, 2),
		models.SeedRepairOrder(3, 3, 3),
		models.SeedRepairOrder(4, 1, 1),
	}

	orders[0].LaborMinutes = 120
	orders[0].AddPart(parts[0], 1)
	orders[0].TransitionTo(support.StatusDiagnosing, "seeder")
	orders[0].TransitionTo(support.StatusRepairing, "seeder")
	orders[0].TransitionTo(support.StatusCompleted, "seeder")

	orders[1].LaborMinutes = 45
	orders[1].Priority = support.PriorityRush
	orders[1].AddPart(parts[1], 2)
	orders[1].TransitionTo(support.StatusDiagnosing, "seeder")
	orders[1].TransitionTo(support.StatusAwaitingParts, "seeder")

	orders[2].LaborMinutes = 90
	orders[2].Priority = support.PriorityWarranty
	orders[2].AddPart(parts[2], 1)
	orders[2].AddPart(parts[3], 1)
	orders[2].TransitionTo(support.StatusDiagnosing, "seeder")
	orders[2].TransitionTo(support.StatusRepairing, "seeder")

	orders[3].LaborMinutes = 30

	invoices := []*models.Invoice{
		models.NewInvoice(1, 1, money.FromCents(34900)),
		models.NewInvoice(2, 2, money.FromCents(23425)),
	}

	return &Dataset{
		Customers:   customers,
		Devices:     devices,
		Orders:      orders,
		Parts:       parts,
		Technicians: technicians,
		Invoices:    invoices,
	}
}

// Len counts orders, so the dataset reads like a collection.
func (d *Dataset) Len() int {
	return len(d.Orders)
}

// Each calls visit for every order: the iteration shape the reports use.
func (d *Dataset) Each(visit func(order *models.RepairOrder)) {
	for _, order := range d.Orders {
		visit(order)
	}
}

// Iterate is a RANGE-OVER-FUNC iterator (Go 1.23): the returned closure is
// driven by `for order := range data.Iterate()`, which is what a generator
// looks like in Go. The loop body reaches it only through the yield callback.
func (d *Dataset) Iterate() iter.Seq[*models.RepairOrder] {
	return func(yield func(*models.RepairOrder) bool) {
		for _, order := range d.Orders {
			if !yield(order) {
				return
			}
		}
	}
}

// OrdersOf returns the orders of one customer.
func (d *Dataset) OrdersOf(customerID int) []*models.RepairOrder {
	found := make([]*models.RepairOrder, 0, len(d.Orders))
	for _, order := range d.Orders {
		if order.CustomerID == customerID {
			found = append(found, order)
		}
	}
	return found
}

// CompletedOrders are the orders that left the workshop.
func (d *Dataset) CompletedOrders() []*models.RepairOrder {
	found := make([]*models.RepairOrder, 0, len(d.Orders))
	for _, order := range d.Orders {
		if !order.IsOpen() {
			found = append(found, order)
		}
	}
	return found
}

// OpenOrders are the orders still in the workshop.
func (d *Dataset) OpenOrders() []*models.RepairOrder {
	found := make([]*models.RepairOrder, 0, len(d.Orders))
	for _, order := range d.Orders {
		if order.IsOpen() {
			found = append(found, order)
		}
	}
	return found
}

// Part looks a part up by SKU.
func (d *Dataset) Part(sku string) (*models.Part, bool) {
	for _, part := range d.Parts {
		if part.SKU == sku {
			return part, true
		}
	}
	return nil, false
}

// LowStockParts are the parts at or below their reorder level.
func (d *Dataset) LowStockParts() []*models.Part {
	found := make([]*models.Part, 0, len(d.Parts))
	for _, part := range d.Parts {
		if part.IsLowStock() {
			found = append(found, part)
		}
	}
	return found
}

// OrderByReference resolves "AT-2026-000001" to its order.
func (d *Dataset) OrderByReference(reference string) (*models.RepairOrder, bool) {
	for _, order := range d.Orders {
		if order.Reference() == reference {
			return order, true
		}
	}
	return nil, false
}

// RevenueCents is 58325: the sum of both invoices.
func (d *Dataset) RevenueCents() int64 {
	total := int64(0)
	for _, invoice := range d.Invoices {
		total += invoice.Total.Cents()
	}
	return total
}

// PartsCostCents is 46300: the sum of every part line on every order.
func (d *Dataset) PartsCostCents() int64 {
	total := int64(0)
	for _, order := range d.Orders {
		total += order.PartsSubtotal().Cents()
	}
	return total
}

// GrossProfitCents is 12025: revenue minus part cost.
func (d *Dataset) GrossProfitCents() int64 {
	return d.RevenueCents() - d.PartsCostCents()
}

// LabourMinutes is the total recorded labour.
func (d *Dataset) LabourMinutes() int {
	total := 0
	for _, order := range d.Orders {
		total += order.LaborMinutes
	}
	return total
}
