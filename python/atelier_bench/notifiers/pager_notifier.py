"""pager notifier."""

from __future__ import annotations

from ..contracts.notifier_contract import Delivery
from ..support.abstract_notifier import AbstractNotifier


class PagerNotifier(AbstractNotifier):
    CHANNEL = "pager"

    def __init__(self, endpoint: str = "https://pager.test/v2") -> None:
        super().__init__(self.CHANNEL, 512, endpoint)

    def send(self, subject: str, body: str) -> Delivery:
        self.guard(subject, body)
        return self.deliver(subject)
