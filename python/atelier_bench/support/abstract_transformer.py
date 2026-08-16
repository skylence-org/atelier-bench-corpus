"""AbstractTransformer base class."""

from abc import ABC, abstractmethod
from typing import Any


class AbstractTransformer(ABC):
    """Base class for all transformers."""

    @abstractmethod
    def transform(self, source: Any) -> Any:
        """Transform source data."""
        pass

    @abstractmethod
    def reverse(self, transformed: Any) -> Any:
        """Reverse the transformation."""
        pass

    def transform_many(self, sources: list[Any]) -> list[Any]:
        """Transform multiple sources."""
        return [self.transform(s) for s in sources]
