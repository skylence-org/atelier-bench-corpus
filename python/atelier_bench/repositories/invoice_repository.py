"""InvoiceRepository: pins Repository[int, Invoice]; the generic Protocol is satisfied structurally."""

from __future__ import annotations

from collections.abc import Sequence

from atelier_core import Invoice
from atelier_core.contracts.repository import Repository


class InvoiceRepository:
    """Satisfies `Repository[int, Invoice]` without naming it."""

    def __init__(self, records: Sequence[Invoice] = ()) -> None:
        self.records = list(records)

    def find(self, key: int) -> Invoice | None:
        return next((record for record in self.records if record.id == key), None)

    def all(self) -> Sequence[Invoice]:
        return self.records

    def count(self) -> int:
        return len(self.records)

    def unpaid(self) -> list[Invoice]:
        return [invoice for invoice in self.records if not invoice.paid]


def as_repository(repository: InvoiceRepository) -> Repository[int, Invoice]:
    """The only place the Protocol name meets the class: a typed pass-through."""
    return repository
