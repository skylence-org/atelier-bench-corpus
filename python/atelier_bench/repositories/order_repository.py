"""OrderRepository: pins Repository[int, RepairOrder]; the generic Protocol is satisfied structurally."""

from __future__ import annotations

from collections.abc import Sequence

from atelier_core import RepairOrder
from atelier_core.contracts.repository import Repository


class OrderRepository:
    """Satisfies `Repository[int, RepairOrder]` without naming it."""

    def __init__(self, records: Sequence[RepairOrder] = ()) -> None:
        self.records = list(records)

    def find(self, key: int) -> RepairOrder | None:
        return next((record for record in self.records if record.id == key), None)

    def all(self) -> Sequence[RepairOrder]:
        return self.records

    def count(self) -> int:
        return len(self.records)

    def open(self) -> list[RepairOrder]:
        return [order for order in self.records if order.is_open()]


def as_repository(repository: OrderRepository) -> Repository[int, RepairOrder]:
    """The only place the Protocol name meets the class: a typed pass-through."""
    return repository
