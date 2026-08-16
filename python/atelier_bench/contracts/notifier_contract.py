"""NotifierContract ABC and its error type."""

from abc import ABC, abstractmethod


class NotifyError(Exception):
    """Base error for notifier contract violations."""


class NotifierContract(ABC):
    """Nominal parent for notifiers."""

    @abstractmethod
    def notify(self, message: str) -> None:
        """Send a notification."""
        pass

    @abstractmethod
    def is_available(self) -> bool:
        """Check if notifier is available."""
        pass
