"""
Money as an immutable cent amount.

Operator overloading (`__add__`, `__sub__`, `__mul__`, `__neg__`), rich
comparison, `__slots__`, a class-level constant, a `@classmethod` factory and
`__str__` — the arithmetic surface every lane carries, spelled the Python way.
"""

from __future__ import annotations

import re
from functools import total_ordering
from typing import Iterable

_MONEY_PATTERN = re.compile(r"^-?\d+(\.\d{1,2})?$")


@total_ordering
class Money:
    """Cent-precise amount. `Money.ZERO` is the additive identity."""

    __slots__ = ("_cents",)

    ZERO: "Money"

    def __init__(self, cents: int) -> None:
        self._cents = int(cents)

    @property
    def cents(self) -> int:
        return self._cents

    @property
    def euros(self) -> int:
        return int(self._cents / 100)

    def with_surcharge_bp(self, bp: int) -> "Money":
        """Add a basis-point surcharge, rounded half-up on the cent."""
        return Money(self._cents + (self._cents * bp + 5000) // 10000)

    def plus(self, other: "Money") -> "Money":
        return Money(self._cents + other.cents)

    def minus(self, other: "Money") -> "Money":
        return Money(self._cents - other.cents)

    def times(self, factor: int) -> "Money":
        return Money(self._cents * factor)

    def is_zero(self) -> bool:
        return self._cents == 0

    def __add__(self, other: "Money") -> "Money":
        return self.plus(other)

    def __sub__(self, other: "Money") -> "Money":
        return self.minus(other)

    def __mul__(self, factor: int) -> "Money":
        return self.times(factor)

    def __neg__(self) -> "Money":
        return Money(-self._cents)

    def __eq__(self, other: object) -> bool:
        return isinstance(other, Money) and other.cents == self._cents

    def __lt__(self, other: "Money") -> bool:
        return self._cents < other.cents

    def __hash__(self) -> int:
        return hash(self._cents)

    def __repr__(self) -> str:
        return f"Money({self._cents})"

    def __str__(self) -> str:
        sign = "-" if self._cents < 0 else ""
        magnitude = abs(self._cents)
        return f"{sign}{magnitude // 100}.{magnitude % 100:02d}"

    @classmethod
    def from_cents(cls, cents: int) -> "Money":
        return cls(cents)

    @classmethod
    def parse(cls, raw: str) -> "Money":
        """Parse `"12.34"`; raises ValueError on anything else."""
        trimmed = raw.strip()
        if not _MONEY_PATTERN.match(trimmed):
            raise ValueError(f"malformed money value {raw!r}")
        whole, _, fraction = trimmed.partition(".")
        return cls(int(whole) * 100 + int((fraction or "0").ljust(2, "0")))

    @staticmethod
    def sum(amounts: Iterable["Money"]) -> "Money":
        total = Money.ZERO
        for amount in amounts:
            total = total + amount
        return total


Money.ZERO = Money(0)
