"""slack notifier."""

from __future__ import annotations

from ..contracts.notifier_contract import Delivery
from ..support.abstract_notifier import AbstractNotifier


class SlackNotifier(AbstractNotifier):
    CHANNEL = "slack"

    def __init__(self, endpoint: str = "https://slack.test/hook") -> None:
        super().__init__(self.CHANNEL, 3000, endpoint)

    def send(self, subject: str, body: str) -> Delivery:
        self.guard(subject, body)
        return self.deliver(subject)
