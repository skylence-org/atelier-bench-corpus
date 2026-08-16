"""NotifierContract ABC and its error type."""

from __future__ import annotations

from abc import ABC, abstractmethod
from typing import TypedDict


class Delivery(TypedDict):
    channel: str
    reference: str


class NotifyError(Exception):
    def __init__(self, channel: str, reason: str, message: str) -> None:
        super().__init__(message)
        self.channel = channel
        self.reason = reason


class NotifierContract(ABC):
    channel: str

    @abstractmethod
    def send(self, subject: str, body: str) -> Delivery: ...
