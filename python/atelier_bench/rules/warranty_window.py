"""warranty-window rule (nominal: subclasses RuleContract)."""

from __future__ import annotations

from typing import TYPE_CHECKING

from atelier_core import Priority

from ..contracts.rule_contract import RuleContract

if TYPE_CHECKING:
    from ..dataset import Dataset


class WarrantyWindowRule(RuleContract):
    KEY = "warranty-window"

    def __init__(self) -> None:
        self.key = self.KEY

    def evaluate(self, data: "Dataset") -> bool:
        return any(order.priority is Priority.WARRANTY for order in data.orders)
