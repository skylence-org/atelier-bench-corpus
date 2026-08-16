"""rework-limit rule (nominal: subclasses RuleContract)."""

from __future__ import annotations

from typing import TYPE_CHECKING

from ..contracts.rule_contract import RuleContract

if TYPE_CHECKING:
    from ..dataset import Dataset


class ReworkLimitRule(RuleContract):
    KEY = "rework-limit"

    def __init__(self) -> None:
        self.key = self.KEY

    def evaluate(self, data: "Dataset") -> bool:
        return all(len(order.log) <= 4 for order in data.orders)
