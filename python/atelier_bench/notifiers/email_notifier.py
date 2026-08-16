"""email notifier."""

from __future__ import annotations

from ..contracts.notifier_contract import Delivery
from ..support.abstract_notifier import AbstractNotifier


class EmailNotifier(AbstractNotifier):
    CHANNEL = "email"

    def __init__(self, endpoint: str = "smtp://mail.test:25") -> None:
        super().__init__(self.CHANNEL, 65536, endpoint)

    def send(self, subject: str, body: str) -> Delivery:
        self.guard(subject, body)
        return self.deliver(subject)
