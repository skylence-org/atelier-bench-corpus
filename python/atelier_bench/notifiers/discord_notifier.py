"""discord notifier."""

from __future__ import annotations

from ..contracts.notifier_contract import Delivery
from ..support.abstract_notifier import AbstractNotifier


class DiscordNotifier(AbstractNotifier):
    CHANNEL = "discord"

    def __init__(self, endpoint: str = "https://discord.test/hook") -> None:
        super().__init__(self.CHANNEL, 2000, endpoint)

    def send(self, subject: str, body: str) -> Delivery:
        self.guard(subject, body)
        return self.deliver(subject)
