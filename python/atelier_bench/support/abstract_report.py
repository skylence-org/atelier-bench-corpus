"""AbstractReport with __init_subclass__ registry."""

from abc import ABC, abstractmethod
from typing import Callable


class AbstractReport(ABC):
    """Base class for all reports with automatic registry via __init_subclass__."""

    REGISTRY: dict[str, Callable[[], "AbstractReport"]] = {}

    def __init_subclass__(cls, **kwargs):
        """Register subclass in the report registry."""
        super().__init_subclass__(**kwargs)
        if not hasattr(cls, "_abstract"):
            cls.REGISTRY[cls.__name__] = cls

    @abstractmethod
    def run(self):
        """Execute the report."""
        pass

    @abstractmethod
    def formatted(self) -> str:
        """Return formatted report output."""
        pass
