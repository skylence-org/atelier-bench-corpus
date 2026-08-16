"""
Structural concern: `HasFormatting` is a Protocol and `formatting` is a plain
object that satisfies it without naming it anywhere.
"""

from __future__ import annotations

from types import SimpleNamespace
from typing import Protocol, runtime_checkable


@runtime_checkable
class HasFormatting(Protocol):
    def format_value(self, value: float) -> str: ...

    def format_label(self, label: str) -> str: ...


formatting = SimpleNamespace(
    format_value=lambda value: f"{value:.2f}",
    format_label=lambda label: label.strip(),
)


def is_formatting(candidate: object) -> bool:
    return isinstance(candidate, HasFormatting)
