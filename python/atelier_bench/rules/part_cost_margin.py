"""part-cost-margin rule (nominal: subclasses RuleContract)."""

from __future__ import annotations

from typing import TYPE_CHECKING

from ..contracts.rule_contract import RuleContract

if TYPE_CHECKING:
    from ..dataset import Dataset


class PartCostMarginRule(RuleContract):
    KEY = "part-cost-margin"

    def __init__(self) -> None:
        self.key = self.KEY

    def evaluate(self, data: "Dataset") -> bool:
        return data.parts_cost_cents() < data.revenue_cents()
