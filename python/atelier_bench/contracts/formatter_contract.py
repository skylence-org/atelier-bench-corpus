"""
FormatterContract: a mixin ABC with concrete formatting, plus `format_cell`,
a `functools.singledispatch` function whose registrations live below the
generic definition.
"""

from __future__ import annotations

from abc import ABC
from functools import singledispatch

from atelier_core import Money


class FormatterContract(ABC):
    def format_cents(self, cents: int) -> str:
        sign = "-" if cents < 0 else ""
        magnitude = abs(cents)
        return f"{sign}{magnitude // 100}.{magnitude % 100:02d}"

    def format_percent(self, ratio: float) -> str:
        return f"{ratio * 100:.1f}%"

    def format_count(self, count: int) -> str:
        return str(count)


@singledispatch
def format_cell(value: object) -> str:
    """Generic fallback; the registered overloads below win for their types."""
    return str(value)


@format_cell.register
def _(value: Money) -> str:
    return str(value)


@format_cell.register
def _(value: float) -> str:
    return f"{value:.2f}"


@format_cell.register
def _(value: int) -> str:
    return f"{value:d}"
