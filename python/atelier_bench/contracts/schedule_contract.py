"""ScheduleContract ABC with the Cadence enum."""

from __future__ import annotations

from abc import ABC
from enum import Enum


class Cadence(Enum):
    HOURLY = "hourly"
    DAILY = "daily"
    WEEKLY = "weekly"
    MONTHLY = "monthly"

    def seconds(self) -> int:
        return _SECONDS[self]


_SECONDS = {Cadence.HOURLY: 3600, Cadence.DAILY: 86400, Cadence.WEEKLY: 604800, Cadence.MONTHLY: 2592000}


class ScheduleContract(ABC):
    cadence: Cadence = Cadence.DAILY

    def next_run_seconds(self, now: int) -> int:
        period = self.cadence.seconds()
        return now - (now % period) + period
