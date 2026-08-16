"""FormatterContract ABC, format_cell function, and its error type."""

from abc import ABC, abstractmethod
from typing import Any


class FormatterError(Exception):
    """Base error for formatter contract violations."""


class FormatterContract(ABC):
    """Nominal parent for formatters."""

    @abstractmethod
    def format(self, value: Any) -> str:
        """Format a value to string."""
        pass


def format_cell(value: Any) -> str:
    """Format a cell value for display."""
    from atelier_core import Money
    
    if isinstance(value, Money):
        return f"{value.cents / 100:.2f}"
    elif isinstance(value, float):
        return f"{value:.2f}"
    elif isinstance(value, int):
        return str(value)
    return str(value)
