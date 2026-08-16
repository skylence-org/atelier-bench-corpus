"""webhook notifier."""

from __future__ import annotations

from ..contracts.notifier_contract import Delivery
from ..support.abstract_notifier import AbstractNotifier


class WebhookNotifier(AbstractNotifier):
    CHANNEL = "webhook"

    def __init__(self, endpoint: str = "https://hooks.test/generic") -> None:
        super().__init__(self.CHANNEL, 8192, endpoint)

    def send(self, subject: str, body: str) -> Delivery:
        self.guard(subject, body)
        return self.deliver(subject)
