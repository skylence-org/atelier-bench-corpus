"""TechnicianRepository: pins Repository[int, Technician]; the generic Protocol is satisfied structurally."""

from __future__ import annotations

from collections.abc import Sequence

from atelier_core import Technician
from atelier_core.contracts.repository import Repository


class TechnicianRepository:
    """Satisfies `Repository[int, Technician]` without naming it."""

    def __init__(self, records: Sequence[Technician] = ()) -> None:
        self.records = list(records)

    def find(self, key: int) -> Technician | None:
        return next((record for record in self.records if record.id == key), None)

    def all(self) -> Sequence[Technician]:
        return self.records

    def count(self) -> int:
        return len(self.records)

    def available(self) -> list[Technician]:
        return [technician for technician in self.records if technician.next_slot() is not None]


def as_repository(repository: TechnicianRepository) -> Repository[int, Technician]:
    """The only place the Protocol name meets the class: a typed pass-through."""
    return repository
