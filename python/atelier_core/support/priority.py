"""Priority as a `str` Enum with methods and a class-level surcharge table."""

from __future__ import annotations

from enum import Enum


class Priority(str, Enum):
    """Members are the wire values; methods hang off the enum itself."""

    STANDARD = "standard"
    RUSH = "rush"
    WARRANTY = "warranty"

    def surcharge_bp(self) -> int:
        """Basis points added on top of the standard price."""
        return _SURCHARGE_BP[self]

    def label(self) -> str:
        return _LABELS[self]

    def is_expedited(self) -> bool:
        return self is Priority.RUSH

    def is_billable(self) -> bool:
        return self is not Priority.WARRANTY


_SURCHARGE_BP = {Priority.STANDARD: 0, Priority.RUSH: 2500, Priority.WARRANTY: 0}
_LABELS = {Priority.STANDARD: "Standard", Priority.RUSH: "Rush", Priority.WARRANTY: "Warranty"}
