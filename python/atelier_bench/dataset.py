"""Deterministic in-memory dataset.

Fixed rows, no randomness: every lane of this corpus produces identical numbers
so bench expectations can be hard-coded.
"""

from atelier_core import Customer, Device, Invoice, Money, Part, RepairOrder, RepairStatus, make_technician
from typing import Generator


class Dataset:
    """Everything a report, metric, service, or rule reads from."""

    def __init__(self, customers, devices, orders, parts, technicians, invoices):
        self.customers = customers
        self.devices = devices
        self.orders = orders
        self.parts = parts
        self.technicians = technicians
        self.invoices = invoices

    @classmethod
    def seeded(cls) -> "Dataset":
        """The frozen seed. Changing these rows changes bench ground truth."""
        customers = [
            Customer.seed(1, "Ada Byron", "ada@example.test", "+32 470 00 00 01"),
            Customer.seed(2, "Grace Hopper", "grace@example.test"),
            Customer.seed(3, "Alan Turing", "alan@example.test", "+32 470 00 00 03"),
        ]

        devices = [
            Device(1, 1, "Framework", "13", "SER-0001"),
            Device(2, 2, "Lenovo", "X1", "SER-0002"),
            Device(3, 3, "Apple", "MBP 14"),
        ]

        parts = [
            Part(1, "SCR-13", 'Screen 13"', Money(19900), 4),
            Part(2, "BAT-55", "Battery 55Wh", Money(8900), 1),
            Part(3, "KBD-EU", "Keyboard EU", Money(6400), 7),
            Part(4, "FAN-A1", "Cooling fan", Money(2200), 2),
        ]

        technicians = [
            make_technician(1, "Nel"),
            make_technician(2, "Rik"),
            make_technician(3, "Sam"),
        ]

        orders = [
            RepairOrder.seed(1, 1, 1),
            RepairOrder.seed(2, 2, 2),
            RepairOrder.seed(3, 3, 3),
            RepairOrder.seed(4, 1, 1),
        ]

        orders[0].laborMinutes = 120
        orders[0].add_part(parts[0], 1)
        orders[0].transition_to(RepairStatus.DIAGNOSING, "seeder")
        orders[0].transition_to(RepairStatus.REPAIRING, "seeder")
        orders[0].transition_to(RepairStatus.COMPLETED, "seeder")

        orders[1].laborMinutes = 45
        orders[1].priority = "rush"
        orders[1].add_part(parts[1], 2)
        orders[1].transition_to(RepairStatus.DIAGNOSING, "seeder")
        orders[1].transition_to(RepairStatus.AWAITING_PARTS, "seeder")

        orders[2].laborMinutes = 90
        orders[2].priority = "warranty"
        orders[2].add_part(parts[2], 1)
        orders[2].add_part(parts[3], 1)
        orders[2].transition_to(RepairStatus.DIAGNOSING, "seeder")
        orders[2].transition_to(RepairStatus.REPAIRING, "seeder")

        invoices = [
            Invoice(1, 1, Money(34900)),
            Invoice(2, 2, Money(23425)),
        ]

        return cls(customers, devices, orders, parts, technicians, invoices)

    def __iter__(self) -> Generator[RepairOrder, None, None]:
        """Iterating a dataset iterates its orders."""
        yield from self.orders

    def orders_of(self, customer_id: int) -> Generator[RepairOrder, None, None]:
        """Lazily walk the orders of one customer."""
        for order in self:
            if order.customerId == customer_id:
                yield order

    def completed_orders(self) -> list[RepairOrder]:
        """Orders that have reached a billable end state."""
        return [order for order in self.orders if not order.is_open()]

    def open_orders(self) -> list[RepairOrder]:
        """Orders still occupying bench space."""
        return [order for order in self.orders if order.is_open()]

    def orders_for(self, customer_id: int) -> list[RepairOrder]:
        """Get all orders for a customer."""
        return list(self.orders_of(customer_id))

    def part(self, sku: str) -> Part | None:
        """Get a part by SKU."""
        for part in self.parts:
            if part.sku == sku:
                return part
        return None

    def low_stock_parts(self) -> list[Part]:
        """Get parts with low stock."""
        return [part for part in self.parts if part.is_low_stock()]

    def revenue_cents(self) -> int:
        """Sum of every issued invoice, in cents."""
        return sum(invoice.total.cents for invoice in self.invoices)

    def parts_cost_cents(self) -> int:
        """Sum of every part line across every order, in cents."""
        return sum(order.parts_subtotal().cents for order in self.orders)

    def labour_minutes(self) -> int:
        """Sum of labour minutes across all orders."""
        return sum(order.laborMinutes for order in self.orders)
