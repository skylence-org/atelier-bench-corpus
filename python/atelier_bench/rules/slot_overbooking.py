"""slot-overbooking rule (nominal: subclasses RuleContract)."""

from __future__ import annotations

from typing import TYPE_CHECKING

from ..contracts.rule_contract import RuleContract

if TYPE_CHECKING:
    from ..dataset import Dataset


class SlotOverbookingRule(RuleContract):
    KEY = "slot-overbooking"

    def __init__(self) -> None:
        self.key = self.KEY

    def evaluate(self, data: "Dataset") -> bool:
        return all(technician.booked_count() == 0 for technician in data.technicians)
