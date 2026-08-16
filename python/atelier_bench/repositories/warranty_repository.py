"""WarrantyRepository: pins Repository[int, Claim]; the generic Protocol is satisfied structurally."""

from __future__ import annotations

from collections.abc import Sequence
from dataclasses import dataclass

from atelier_core.contracts.repository import Repository


@dataclass(frozen=True)
class Claim:
    id: int
    order_id: int
    settled: bool = False


class WarrantyRepository:
    """Satisfies `Repository[int, Claim]` without naming it."""

    def __init__(self, records: Sequence[Claim] = ()) -> None:
        self.records = list(records)

    def find(self, key: int) -> Claim | None:
        return next((record for record in self.records if record.id == key), None)

    def all(self) -> Sequence[Claim]:
        return self.records

    def count(self) -> int:
        return len(self.records)

    def pending(self) -> list[Claim]:
        return [claim for claim in self.records if not claim.settled]


def as_repository(repository: WarrantyRepository) -> Repository[int, Claim]:
    """The only place the Protocol name meets the class: a typed pass-through."""
    return repository
