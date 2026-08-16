"""
The frozen dataset every lane reproduces. Changing these rows changes bench
ground truth in four other lanes: revenue 58325c, part cost 46300c, gross
profit 12025c, 4 orders / 3 customers / 4 parts / 2 invoices.

`__iter__` is a generator (`for order in data`), `orders_of` a generator
method, and `__len__` counts orders.
"""

from __future__ import annotations

from collections.abc import Iterator

from atelier_core import (
    Customer,
    Device,
    Invoice,
    Money,
    Part,
    Priority,
    RepairOrder,
    RepairStatus,
    Technician,
    make_technician,
)


class Dataset:
    def __init__(
        self,
        customers: list[Customer],
        devices: list[Device],
        orders: list[RepairOrder],
        parts: list[Part],
        technicians: list[Technician],
        invoices: list[Invoice],
    ) -> None:
        self.customers = customers
        self.devices = devices
        self.orders = orders
        self.parts = parts
        self.technicians = technicians
        self.invoices = invoices

    @classmethod
    def seeded(cls) -> "Dataset":
        """Frozen seed. Changing these rows changes bench ground truth."""
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
        technicians = [make_technician(1, "Nel"), make_technician(2, "Rik"), make_technician(3, "Sam")]
        orders = [
            RepairOrder.seed(1, 1, 1),
            RepairOrder.seed(2, 2, 2),
            RepairOrder.seed(3, 3, 3),
            RepairOrder.seed(4, 1, 1),
        ]

        orders[0].labor_minutes = 120
        orders[0].add_part(parts[0], 1)
        orders[0].transition_to(RepairStatus.DIAGNOSING, "seeder")
        orders[0].transition_to(RepairStatus.REPAIRING, "seeder")
        orders[0].transition_to(RepairStatus.COMPLETED, "seeder")

        orders[1].labor_minutes = 45
        orders[1].priority = Priority.RUSH
        orders[1].add_part(parts[1], 2)
        orders[1].transition_to(RepairStatus.DIAGNOSING, "seeder")
        orders[1].transition_to(RepairStatus.AWAITING_PARTS, "seeder")

        orders[2].labor_minutes = 90
        orders[2].priority = Priority.WARRANTY
        orders[2].add_part(parts[2], 1)
        orders[2].add_part(parts[3], 1)
        orders[2].transition_to(RepairStatus.DIAGNOSING, "seeder")
        orders[2].transition_to(RepairStatus.REPAIRING, "seeder")

        orders[3].labor_minutes = 30

        invoices = [Invoice(1, 1, Money(34900)), Invoice(2, 2, Money(23425))]
        return cls(customers, devices, orders, parts, technicians, invoices)

    def __iter__(self) -> Iterator[RepairOrder]:
        yield from self.orders

    def __len__(self) -> int:
        return len(self.orders)

    def orders_of(self, customer_id: int) -> Iterator[RepairOrder]:
        for order in self:
            if order.customer_id == customer_id:
                yield order

    def completed_orders(self) -> list[RepairOrder]:
        return [order for order in self.orders if not order.is_open()]

    def open_orders(self) -> list[RepairOrder]:
        return [order for order in self.orders if order.is_open()]

    def orders_for(self, customer_id: int) -> list[RepairOrder]:
        return list(self.orders_of(customer_id))

    def part(self, sku: str) -> Part | None:
        return next((part for part in self.parts if part.sku == sku), None)

    def low_stock_parts(self) -> list[Part]:
        return [part for part in self.parts if part.is_low_stock()]

    def revenue_cents(self) -> int:
        return sum(invoice.total.cents for invoice in self.invoices)

    def parts_cost_cents(self) -> int:
        return sum(order.parts_subtotal().cents for order in self.orders)

    def labour_minutes(self) -> int:
        return sum(order.labor_minutes for order in self.orders)
