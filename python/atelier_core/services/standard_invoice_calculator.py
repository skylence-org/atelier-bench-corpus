"""Standard pricing: labour at a flat hourly rate plus parts. Satisfies InvoiceCalculator structurally."""

from __future__ import annotations

from typing import TYPE_CHECKING

from ..money import Money

if TYPE_CHECKING:
    from ..models.repair_order import RepairOrder


class StandardInvoiceCalculator:
    DEFAULT_RATE_CENTS = 7500

    def __init__(self, labour_rate_cents_per_hour: int = DEFAULT_RATE_CENTS) -> None:
        self.name = "standard"
        self.applies_surcharge = False
        self.labour_rate_cents_per_hour = labour_rate_cents_per_hour

    def calculate(self, order: "RepairOrder") -> Money:
        return self.labour(order) + order.parts_subtotal()

    def labour(self, order: "RepairOrder") -> Money:
        return Money(self.labour_rate_cents_per_hour * order.labor_minutes // 60)
