"""PartRepository: pins Repository[int, Part]; the generic Protocol is satisfied structurally."""

from __future__ import annotations

from collections.abc import Sequence

from atelier_core import Part
from atelier_core.contracts.repository import Repository


class PartRepository:
    """Satisfies `Repository[int, Part]` without naming it."""

    def __init__(self, records: Sequence[Part] = ()) -> None:
        self.records = list(records)

    def find(self, key: int) -> Part | None:
        return next((record for record in self.records if record.id == key), None)

    def all(self) -> Sequence[Part]:
        return self.records

    def count(self) -> int:
        return len(self.records)

    def by_sku(self, sku: str) -> Part | None:
        return next((part for part in self.records if part.sku == sku), None)


def as_repository(repository: PartRepository) -> Repository[int, Part]:
    """The only place the Protocol name meets the class: a typed pass-through."""
    return repository
