"""TransformerContract ABC and its error type."""

from abc import ABC, abstractmethod
from typing import Any, TypeVar

T = TypeVar("T")


class TransformError(Exception):
    """Base error for transformer contract violations."""


class TransformerContract(ABC):
    """Nominal parent for transformers."""

    @abstractmethod
    def transform(self, source: Any) -> Any:
        """Transform source data."""
        pass

    @abstractmethod
    def reverse(self, transformed: Any) -> Any:
        """Reverse the transformation."""
        pass
