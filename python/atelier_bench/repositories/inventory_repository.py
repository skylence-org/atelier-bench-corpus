"""InventoryRepository: pins Repository[int, Movement]; the generic Protocol is satisfied structurally."""

from __future__ import annotations

from collections.abc import Sequence
from dataclasses import dataclass

from atelier_core.contracts.repository import Repository


@dataclass(frozen=True)
class Movement:
    id: int
    sku: str
    delta: int


class InventoryRepository:
    """Satisfies `Repository[int, Movement]` without naming it."""

    def __init__(self, records: Sequence[Movement] = ()) -> None:
        self.records = list(records)

    def find(self, key: int) -> Movement | None:
        return next((record for record in self.records if record.id == key), None)

    def all(self) -> Sequence[Movement]:
        return self.records

    def count(self) -> int:
        return len(self.records)

    def net_for(self, sku: str) -> int:
        return sum(movement.delta for movement in self.records if movement.sku == sku)


def as_repository(repository: InventoryRepository) -> Repository[int, Movement]:
    """The only place the Protocol name meets the class: a typed pass-through."""
    return repository
