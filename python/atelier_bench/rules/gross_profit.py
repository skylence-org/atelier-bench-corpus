"""gross-profit rule (nominal: subclasses RuleContract)."""

from __future__ import annotations

from typing import TYPE_CHECKING

from ..contracts.rule_contract import RuleContract

if TYPE_CHECKING:
    from ..dataset import Dataset


class GrossProfitRule(RuleContract):
    KEY = "gross-profit"

    def __init__(self) -> None:
        self.key = self.KEY

    def evaluate(self, data: "Dataset") -> bool:
        return data.revenue_cents() - data.parts_cost_cents() == 12025
