"""ExportContract ABC and its error type."""

from abc import ABC, abstractmethod
from typing import Any


class ExportError(Exception):
    """Base error for export contract violations."""


class ExportContract(ABC):
    """Nominal parent for exporters."""

    @abstractmethod
    def export(self, data: Any) -> str:
        """Export data to a format."""
        pass

    @abstractmethod
    def supported_formats(self) -> list[str]:
        """List of supported export formats."""
        pass
