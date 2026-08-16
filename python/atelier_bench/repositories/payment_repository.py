"""PaymentRepository: pins Repository[int, Payment]; the generic Protocol is satisfied structurally."""

from __future__ import annotations

from collections.abc import Sequence
from dataclasses import dataclass

from atelier_core.contracts.repository import Repository


@dataclass(frozen=True)
class Payment:
    id: int
    invoice_id: int
    cents: int


class PaymentRepository:
    """Satisfies `Repository[int, Payment]` without naming it."""

    def __init__(self, records: Sequence[Payment] = ()) -> None:
        self.records = list(records)

    def find(self, key: int) -> Payment | None:
        return next((record for record in self.records if record.id == key), None)

    def all(self) -> Sequence[Payment]:
        return self.records

    def count(self) -> int:
        return len(self.records)

    def settled_cents(self) -> int:
        return sum(payment.cents for payment in self.records)


def as_repository(repository: PaymentRepository) -> Repository[int, Payment]:
    """The only place the Protocol name meets the class: a typed pass-through."""
    return repository
