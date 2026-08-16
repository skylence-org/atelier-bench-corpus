"""deposit-required rule (nominal: subclasses RuleContract)."""

from __future__ import annotations

from typing import TYPE_CHECKING

from ..contracts.rule_contract import RuleContract

if TYPE_CHECKING:
    from ..dataset import Dataset


class DepositRequiredRule(RuleContract):
    KEY = "deposit-required"

    def __init__(self) -> None:
        self.key = self.KEY

    def evaluate(self, data: "Dataset") -> bool:
        return len(data.invoices) >= 1
