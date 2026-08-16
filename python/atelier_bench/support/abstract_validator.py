"""AbstractValidator base class."""

from abc import ABC, abstractmethod
from typing import Any


class AbstractValidator(ABC):
    """Base class for all validators."""

    def __init__(self):
        self._errors = []

    @abstractmethod
    def validate(self, data: Any) -> bool:
        """Validate data."""
        pass

    def add_error(self, message: str) -> None:
        """Add a validation error."""
        self._errors.append(message)

    def get_errors(self) -> list[str]:
        """Get all validation errors."""
        return self._errors.copy()

    def clear_errors(self) -> None:
        """Clear all validation errors."""
        self._errors.clear()
