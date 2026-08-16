"""ScheduleContract ABC and its error type."""

from abc import ABC, abstractmethod
from datetime import datetime


class ScheduleError(Exception):
    """Base error for schedule contract violations."""


class ScheduleContract(ABC):
    """Nominal parent for scheduled operations."""

    @abstractmethod
    def scheduled_at(self) -> datetime:
        """Return the scheduled execution time."""
        pass

    @abstractmethod
    def is_due(self) -> bool:
        """Check if operation is due to run."""
        pass

    @abstractmethod
    def mark_executed(self) -> None:
        """Mark as executed."""
        pass
