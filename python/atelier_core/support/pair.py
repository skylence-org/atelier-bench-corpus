"""Sibling exports: most consumers need only one side."""

from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class Left:
    """A validation failure: which field, and why."""

    field: str
    reason: str

    def is_left(self) -> bool:
        return True

    @classmethod
    def of(cls, field: str, reason: str) -> "Left":
        return cls(field, reason)


@dataclass(frozen=True)
class Right:
    """A validated value."""

    value: object

    def is_left(self) -> bool:
        return False

    @classmethod
    def of(cls, value: object) -> "Right":
        return cls(value)
