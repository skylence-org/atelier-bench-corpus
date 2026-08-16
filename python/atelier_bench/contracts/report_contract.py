"""ReportContract ABC and its error type."""

from abc import ABC, abstractmethod


class ReportError(Exception):
    """Base error for report contract violations."""


class ReportContract(ABC):
    """Nominal parent for all reports."""

    @abstractmethod
    def run(self):
        """Execute the report."""
        pass

    @abstractmethod
    def formatted(self):
        """Return formatted report output."""
        pass
