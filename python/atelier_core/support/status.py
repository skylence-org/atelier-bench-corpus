"""RepairStatus as an Enum with a transition table method — the enum-method edge."""

from __future__ import annotations

from enum import Enum


class RepairStatus(str, Enum):
    RECEIVED = "received"
    DIAGNOSING = "diagnosing"
    AWAITING_PARTS = "awaiting_parts"
    REPAIRING = "repairing"
    COMPLETED = "completed"
    COLLECTED = "collected"

    def transitions_to(self) -> tuple["RepairStatus", ...]:
        """Legal next states from this one."""
        return _TRANSITIONS[self]

    def label(self) -> str:
        return _LABELS[self]

    def is_terminal(self) -> bool:
        return len(self.transitions_to()) == 0

    def is_open(self) -> bool:
        return self not in (RepairStatus.COMPLETED, RepairStatus.COLLECTED)


_TRANSITIONS: dict[RepairStatus, tuple[RepairStatus, ...]] = {
    RepairStatus.RECEIVED: (RepairStatus.DIAGNOSING,),
    RepairStatus.DIAGNOSING: (RepairStatus.AWAITING_PARTS, RepairStatus.REPAIRING),
    RepairStatus.AWAITING_PARTS: (RepairStatus.REPAIRING,),
    RepairStatus.REPAIRING: (RepairStatus.COMPLETED,),
    RepairStatus.COMPLETED: (RepairStatus.COLLECTED,),
    RepairStatus.COLLECTED: (),
}
_LABELS = {
    RepairStatus.RECEIVED: "Received",
    RepairStatus.DIAGNOSING: "Diagnosing",
    RepairStatus.AWAITING_PARTS: "Awaiting parts",
    RepairStatus.REPAIRING: "Repairing",
    RepairStatus.COMPLETED: "Completed",
    RepairStatus.COLLECTED: "Collected",
}
