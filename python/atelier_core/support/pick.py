"""Generic helper: the type parameter exists only in the annotations (PEP 695 syntax)."""

from __future__ import annotations

from collections.abc import Callable, Iterable


def first_where[T](items: Iterable[T], predicate: Callable[[T], bool]) -> T | None:
    """First item satisfying `predicate`, or None."""
    for item in items:
        if predicate(item):
            return item
    return None
