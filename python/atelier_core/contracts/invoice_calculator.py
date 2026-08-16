"""
InvoiceCalculator is a `Protocol`: implementors never name it. Two classes
satisfy it structurally (`services/*_invoice_calculator.py`), and the container
binds one of them; `is_invoice_calculator` is the runtime check.
"""

from __future__ import annotations

from typing import TYPE_CHECKING, Protocol, runtime_checkable

from ..money import Money

if TYPE_CHECKING:  # type-only import: no runtime edge to repair_order
    from ..models.repair_order import RepairOrder


@runtime_checkable
class InvoiceCalculator(Protocol):
    name: str
    applies_surcharge: bool

    def calculate(self, order: "RepairOrder") -> Money: ...


def is_invoice_calculator(candidate: object) -> bool:
    return isinstance(candidate, InvoiceCalculator)
