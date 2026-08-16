"""AbstractNotifier base class."""

from abc import ABC, abstractmethod


class AbstractNotifier(ABC):
    """Base class for all notifiers."""

    @abstractmethod
    def send(self, recipient: str, message: str) -> bool:
        """Send a notification."""
        pass

    @abstractmethod
    def is_available(self) -> bool:
        """Check if notifier is available."""
        pass

    @abstractmethod
    def retry_failed(self) -> int:
        """Retry sending failed notifications."""
        pass

    def send_batch(self, recipients: list[str], message: str) -> int:
        """Send notification to multiple recipients."""
        count = 0
        for recipient in recipients:
            if self.send(recipient, message):
                count += 1
        return count
