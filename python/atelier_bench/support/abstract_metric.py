"""AbstractMetric base class."""

from abc import ABC, abstractmethod


class AbstractMetric(ABC):
    """Base class for all metrics."""

    def __init__(self, name: str):
        self.name = name
        self._value = 0

    @abstractmethod
    def calculate(self, data) -> float:
        """Calculate the metric value."""
        pass

    def formatted(self, data) -> str:
        """Return formatted metric."""
        value = self.calculate(data)
        return str(value)
