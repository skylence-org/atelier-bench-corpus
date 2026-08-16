"""priority-escalation rule (nominal: subclasses RuleContract)."""

from __future__ import annotations

from typing import TYPE_CHECKING

from atelier_core import Priority

from ..contracts.rule_contract import RuleContract

if TYPE_CHECKING:
    from ..dataset import Dataset


class PriorityEscalationRule(RuleContract):
    KEY = "priority-escalation"

    def __init__(self) -> None:
        self.key = self.KEY

    def evaluate(self, data: "Dataset") -> bool:
        return any(order.priority is not Priority.STANDARD for order in data.orders)
