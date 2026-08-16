"""schedule-gap rule (nominal: subclasses RuleContract)."""

from __future__ import annotations

from typing import TYPE_CHECKING

from ..contracts.rule_contract import RuleContract

if TYPE_CHECKING:
    from ..dataset import Dataset


class ScheduleGapRule(RuleContract):
    KEY = "schedule-gap"

    def __init__(self) -> None:
        self.key = self.KEY

    def evaluate(self, data: "Dataset") -> bool:
        return all(technician.next_slot() is not None for technician in data.technicians)
