"""
Dynamic attribute forwarding: `ForwardsToSchedule.__getattr__` hands unknown
attribute reads to `self.schedule`, so `technician.next_slot()` resolves at
runtime with no declaration on the technician at all.
"""

from __future__ import annotations

from typing import Any

from ..support.schedule import Schedule


class ForwardsToSchedule:
    """Mixin: only consulted when normal lookup fails (that is how __getattr__ works)."""

    schedule: Schedule

    def __getattr__(self, name: str) -> Any:
        if name.startswith("_"):
            raise AttributeError(name)
        return getattr(self.schedule, name)

    def forwards(self, name: str) -> bool:
        return hasattr(self.schedule, name)
