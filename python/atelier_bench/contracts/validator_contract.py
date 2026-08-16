"""ValidatorContract ABC and its error type."""

from abc import ABC, abstractmethod
from typing import Any


class ValidateError(Exception):
    """Base error for validator contract violations."""


class ValidatorContract(ABC):
    """Nominal parent for validators."""

    @abstractmethod
    def validate(self, data: Any) -> bool:
        """Validate data."""
        pass

    @abstractmethod
    def errors(self) -> list[str]:
        """Return validation errors."""
        pass
