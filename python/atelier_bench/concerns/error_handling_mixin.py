"""Error handling concern mixin."""


class ErrorHandlingMixin:
    """Adds error handling capability to any class."""

    def __init__(self):
        self._errors = []

    def handle_error(self, error: Exception) -> None:
        """Handle an error."""
        self._errors.append({"type": type(error).__name__, "message": str(error)})

    def get_errors(self) -> list[dict]:
        """Get all handled errors."""
        return self._errors.copy()

    def has_errors(self) -> bool:
        """Check if any errors have been handled."""
        return len(self._errors) > 0

    def clear_errors(self) -> None:
        """Clear all handled errors."""
        self._errors.clear()
