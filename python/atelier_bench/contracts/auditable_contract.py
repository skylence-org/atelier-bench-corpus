"""AuditableContract ABC and the module-level entry-id counter."""

from __future__ import annotations

from abc import ABC, abstractmethod
from typing import TypedDict

_counter = 0


class AuditEntry(TypedDict):
    id: str
    actor: str
    action: str


def next_entry_id(actor: str) -> str:
    global _counter
    _counter += 1
    return f"{actor}-{_counter:04d}"


class AuditableContract(ABC):
    @abstractmethod
    def audit_trail(self) -> list[str]: ...
