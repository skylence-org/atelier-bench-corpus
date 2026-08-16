"""Rush pricing: composes the standard calculator and adds the priority surcharge."""

from __future__ import annotations

from typing import TYPE_CHECKING

from ..money import Money
from .standard_invoice_calculator import StandardInvoiceCalculator

if TYPE_CHECKING:
    from ..models.repair_order import RepairOrder


class RushInvoiceCalculator:
    FLAG = "rush-surcharge"

    def __init__(self, inner: StandardInvoiceCalculator | None = None) -> None:
        self.name = "rush"
        self.applies_surcharge = True
        self.inner = inner if inner is not None else StandardInvoiceCalculator()

    def calculate(self, order: "RepairOrder") -> Money:
        base = self.inner.calculate(order)
        if not order.priority.is_billable():
            return base
        return base.with_surcharge_bp(order.priority.surcharge_bp())
