"""
Base notifier. Name-mangled `__sent` counter (stored as `_AbstractNotifier__sent`),
a `Endpoint` DESCRIPTOR validating the endpoint attribute, and `describe_all`
binding a plain function to `self` with `types.MethodType` (the this-rebinding
edge: `loud` is not a method of the class).
"""

from __future__ import annotations

from types import MethodType
from typing import Any

from ..concerns.has_validation import HasValidation, Violation
from ..contracts.notifier_contract import Delivery, NotifierContract, NotifyError


class Endpoint:
    """Descriptor: `__set_name__` learns the attribute name, `__get__`/`__set__` guard it."""

    def __set_name__(self, owner: type, name: str) -> None:
        self.private_name = f"_endpoint_{name}"

    def __get__(self, instance: Any, owner: type | None = None) -> str:
        if instance is None:
            return ""
        return getattr(instance, self.private_name, "")

    def __set__(self, instance: Any, value: str) -> None:
        if not isinstance(value, str):
            raise TypeError("endpoint must be a string")
        setattr(instance, self.private_name, value)


def loud(self: "AbstractNotifier", subject: str) -> str:
    """Free function bound at call time; `self` is whichever notifier binds it."""
    return f"{self.channel.upper()}:{subject}"


class AbstractNotifier(NotifierContract, HasValidation):
    endpoint = Endpoint()

    def __init__(self, channel: str, max_bytes: int, endpoint: str) -> None:
        self.channel = channel
        self.max_bytes = max_bytes
        self.endpoint = endpoint
        self.__sent = 0  # name-mangled to _AbstractNotifier__sent

    def guard(self, subject: str, body: str) -> None:
        if not self.is_configured():
            raise NotifyError(self.channel, "not_configured", f"channel {self.channel} is not configured")
        if len(subject) + len(body) > self.max_bytes:
            raise NotifyError(self.channel, "too_large", f"payload for channel {self.channel} exceeds {self.max_bytes} bytes")

    def deliver(self, subject: str) -> Delivery:
        self.__sent += 1
        return {"channel": self.channel, "reference": f"{self.channel}:{subject}"}

    def sent_count(self) -> int:
        return self.__sent

    def describe_all(self, subjects: list[str]) -> list[str]:
        quiet = lambda subject: f"{self.channel}:{subject}"  # noqa: E731 - closure over self
        bound_loud = MethodType(loud, self)
        return [f"{quiet(subject)} {bound_loud(subject)}" for subject in subjects]

    def bound_sender(self) -> Any:
        return self.send

    def is_configured(self) -> bool:
        return self.endpoint != ""

    def validate(self) -> list[Violation]:
        return [] if self.is_configured() else [{"field": "endpoint", "message": "endpoint is empty"}]
