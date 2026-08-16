"""CompositeContract: three-parent ABC inheriting from report, cacheable, and schedule contracts."""

from abc import ABC
from .report_contract import ReportContract
from .cacheable_contract import CacheableContract
from .schedule_contract import ScheduleContract


class CompositeContract(ReportContract, CacheableContract, ScheduleContract):
    """Three-parent contract combining report, cacheable, and schedule contracts."""
    pass
