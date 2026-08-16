"""
RepairOrder: the lifecycle hub. `reference()` arrives from the `with_reference`
CLASS DECORATOR (setattr-grafted, no HasReference base, no declaration in this
file); `total()` goes through the container's bound calculator.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import TYPE_CHECKING

from ..concerns.has_reference import with_reference
from ..errors import IllegalTransitionError
from ..money import Money
from ..support.priority import Priority
from ..support.status import RepairStatus

if TYPE_CHECKING:
    from ..container import Container
    from .part import Part


@dataclass(frozen=True)
class PartLine:
    part_id: int
    sku: str
    quantity: int
    unit_price: Money


@dataclass(frozen=True)
class LogEntry:
    source: RepairStatus
    target: RepairStatus
    changed_by: str


@with_reference()
class RepairOrder:
    def __init__(self, id: int, customer_id: int, device_id: int) -> None:
        self.id = id
        self.customer_id = customer_id
        self.device_id = device_id
        self.status = RepairStatus.RECEIVED
        self.priority = Priority.STANDARD
        self.labor_minutes = 0
        self.parts: list[PartLine] = []
        self.log: list[LogEntry] = []

    def transition_to(self, next_status: RepairStatus, changed_by: str) -> bool:
        if next_status not in self.status.transitions_to():
            return False
        self.log.append(LogEntry(self.status, next_status, changed_by))
        self.status = next_status
        return True

    def complete(self, changed_by: str) -> None:
        if not self.transition_to(RepairStatus.COMPLETED, changed_by):
            raise IllegalTransitionError(self.status.value, RepairStatus.COMPLETED.value)

    def parts_subtotal(self) -> Money:
        return Money.sum(line.unit_price * line.quantity for line in self.parts)

    def total(self, container: "Container") -> Money:
        return container.invoice_calculator().calculate(self)

    def add_part(self, part: "Part", quantity: int) -> None:
        self.parts.append(PartLine(part.id, part.sku, quantity, part.unit_price))

    def is_open(self) -> bool:
        return self.status.is_open()

    @classmethod
    def seed(cls, id: int, customer_id: int, device_id: int) -> "RepairOrder":
        order = cls(id, customer_id, device_id)
        order.reference_number = id
        return order
