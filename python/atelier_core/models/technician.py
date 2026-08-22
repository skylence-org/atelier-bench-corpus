"""
Technician: `next_slot()` / `book_slot()` / `booked_count()` are NOT declared
here — they resolve through `ForwardsToSchedule.__getattr__` to the Schedule.
"""

from __future__ import annotations

from ..concerns.forwards_to_schedule import ForwardsToSchedule
from ..support.schedule import Schedule


class Technician(ForwardsToSchedule):
    def __init__(self, id: int, name: str, schedule: Schedule | None = None) -> None:
        self.id = id
        self.name = name
        self.schedule = schedule if schedule is not None else Schedule()

    def utilisation(self) -> float:
        capacity = self.schedule.capacity
        return 0.0 if capacity == 0 else self.schedule.booked_count() / capacity

    def set_capacity(self, requested: int) -> int:
        """Writes through the Schedule property setter, which refuses to drop below the booked count."""
        self.schedule.capacity = requested
        return self.schedule.capacity


def make_technician(id: int, name: str, schedule: Schedule | None = None) -> Technician:
    """Factory kept for parity with the other lanes; calls on the result forward to its Schedule."""
    return Technician(id, name, schedule)
