"""Validation concern mixin."""


class ValidationMixin:
    """Adds validation capability to any class."""

    def __init__(self):
        self._validation_errors = []

    def add_error(self, message: str) -> None:
        """Add a validation error."""
        self._validation_errors.append(message)

    def is_valid(self) -> bool:
        """Check if there are any validation errors."""
        return len(self._validation_errors) == 0

    def get_errors(self) -> list[str]:
        """Get all validation errors."""
        return self._validation_errors.copy()

    def clear_errors(self) -> None:
        """Clear all validation errors."""
        self._validation_errors.clear()
