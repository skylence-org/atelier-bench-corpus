"""AbstractScheduler base class."""

from abc import ABC, abstractmethod
from datetime import datetime


class AbstractScheduler(ABC):
    """Base class for all schedulers."""

    @abstractmethod
    def schedule(self, callback, delay_seconds: int) -> str:
        """Schedule a callback to run after delay."""
        pass

    @abstractmethod
    def cancel(self, job_id: str) -> bool:
        """Cancel a scheduled job."""
        pass

    @abstractmethod
    def next_run_time(self, job_id: str) -> datetime | None:
        """Get the next run time for a job."""
        pass

    @abstractmethod
    def is_scheduled(self, job_id: str) -> bool:
        """Check if a job is scheduled."""
        pass
