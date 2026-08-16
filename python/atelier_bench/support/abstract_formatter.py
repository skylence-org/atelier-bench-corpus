"""AbstractFormatter base class."""

from abc import ABC, abstractmethod
from typing import Any


class AbstractFormatter(ABC):
    """Base class for all formatters."""

    def __init__(self, format_spec: str = ""):
        self.format_spec = format_spec

    @abstractmethod
    def format(self, value: Any) -> str:
        """Format a value."""
        pass

    def format_many(self, values: list[Any]) -> list[str]:
        """Format multiple values."""
        return [self.format(v) for v in values]
