"""invoice-balance rule (nominal: subclasses RuleContract)."""

from __future__ import annotations

from typing import TYPE_CHECKING

from ..contracts.rule_contract import RuleContract

if TYPE_CHECKING:
    from ..dataset import Dataset


class InvoiceBalanceRule(RuleContract):
    KEY = "invoice-balance"

    def __init__(self) -> None:
        self.key = self.KEY

    def evaluate(self, data: "Dataset") -> bool:
        return all(invoice.total.cents > 0 for invoice in data.invoices)
