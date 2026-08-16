"""Note attached to any notable record; `NotableKind` is a plain Enum."""

from __future__ import annotations

from enum import Enum


class NotableKind(Enum):
    CUSTOMER = "customer"
    DEVICE = "device"
    REPAIR_ORDER = "repair_order"
    PART = "part"


class Note:
    def __init__(self, id: int, notable_kind: NotableKind, notable_id: int, body: str, author: str = "system") -> None:
        self.id = id
        self.notable_kind = notable_kind
        self.notable_id = notable_id
        self.body = body
        self.author = author

    def excerpt(self, width: int) -> str:
        return self.body if len(self.body) <= width else f"{self.body[: width - 1]}…"
