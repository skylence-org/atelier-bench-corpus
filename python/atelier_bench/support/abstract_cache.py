"""AbstractCache base class."""

from abc import ABC, abstractmethod
from typing import Any


class AbstractCache(ABC):
    """Base class for all caches."""

    @abstractmethod
    def get(self, key: str) -> Any | None:
        """Get a value from cache."""
        pass

    @abstractmethod
    def set(self, key: str, value: Any) -> None:
        """Set a value in cache."""
        pass

    @abstractmethod
    def delete(self, key: str) -> None:
        """Delete a value from cache."""
        pass

    @abstractmethod
    def clear(self) -> None:
        """Clear the entire cache."""
        pass
