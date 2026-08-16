"""Multi-parent surface: three parent contracts in one class statement (real multiple inheritance)."""

from __future__ import annotations

from .cacheable_contract import CacheableContract
from .report_contract import ReportContract
from .schedule_contract import ScheduleContract


class CompositeContract(ReportContract, CacheableContract, ScheduleContract):
    """Abstract (inherits ReportContract.rows); the MRO carries all three parents."""

    def parents(self) -> tuple[str, ...]:
        """The three direct bases of CompositeContract itself, whichever concrete class asks."""
        return tuple(base.__name__ for base in CompositeContract.__bases__)
