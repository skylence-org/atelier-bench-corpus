"""
Technician schedule: a `@property` with a setter, a private set, and the
methods `next_slot` / `book_slot` that Technician forwards to through
`__getattr__` (see concerns/forwards_to_schedule.py).
"""

from __future__ import annotations


class Schedule:
    DEFAULT_CAPACITY = 16

    def __init__(self, capacity: int = DEFAULT_CAPACITY) -> None:
        self._capacity = capacity
        self._booked: set[int] = set()

    @property
    def capacity(self) -> int:
        return self._capacity

    @capacity.setter
    def capacity(self, value: int) -> None:
        self._capacity = max(value, len(self._booked))

    def next_slot(self) -> int | None:
        """First free slot index, or None when fully booked."""
        for slot in range(self._capacity):
            if slot not in self._booked:
                return slot
        return None

    def book_slot(self, slot: int) -> bool:
        if slot >= self._capacity or slot in self._booked:
            return False
        self._booked.add(slot)
        return True

    def booked_count(self) -> int:
        return len(self._booked)
