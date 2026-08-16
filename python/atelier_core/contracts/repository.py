"""Generic repository Protocol; each bench repository pins the record type."""

from __future__ import annotations

from collections.abc import Sequence
from typing import Protocol


class Repository[Id, Rec](Protocol):
    """PEP 695 generic Protocol: `Repository[int, RepairOrder]` at the use site."""

    def find(self, key: Id) -> Rec | None: ...

    def all(self) -> Sequence[Rec]: ...

    def count(self) -> int: ...


def size_of(repository: Repository[object, object]) -> int:
    return repository.count()
