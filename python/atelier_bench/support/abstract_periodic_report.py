"""Report that also runs on a cadence: adds ScheduleContract to the MRO."""

from __future__ import annotations

from ..contracts.schedule_contract import Cadence, ScheduleContract
from .abstract_report import AbstractReport


class AbstractPeriodicReport(AbstractReport, ScheduleContract):
    def __init__(self, slug: str, title: str, cadence: Cadence) -> None:
        super().__init__(slug, title)
        self.cadence = cadence
