"""sms notifier."""

from __future__ import annotations

from ..contracts.notifier_contract import Delivery
from ..support.abstract_notifier import AbstractNotifier


class SmsNotifier(AbstractNotifier):
    CHANNEL = "sms"

    def __init__(self, endpoint: str = "https://sms.test/send") -> None:
        super().__init__(self.CHANNEL, 160, endpoint)

    def send(self, subject: str, body: str) -> Delivery:
        self.guard(subject, body)
        return self.deliver(subject)
