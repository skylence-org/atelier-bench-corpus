"""CustomerRepository: pins Repository[int, Customer]; the generic Protocol is satisfied structurally."""

from __future__ import annotations

from collections.abc import Sequence

from atelier_core import Customer
from atelier_core.contracts.repository import Repository


class CustomerRepository:
    """Satisfies `Repository[int, Customer]` without naming it."""

    def __init__(self, records: Sequence[Customer] = ()) -> None:
        self.records = list(records)

    def find(self, key: int) -> Customer | None:
        return next((record for record in self.records if record.id == key), None)

    def all(self) -> Sequence[Customer]:
        return self.records

    def count(self) -> int:
        return len(self.records)

    def reachable(self) -> list[Customer]:
        return [customer for customer in self.records if customer.is_reachable()]


def as_repository(repository: CustomerRepository) -> Repository[int, Customer]:
    """The only place the Protocol name meets the class: a typed pass-through."""
    return repository
