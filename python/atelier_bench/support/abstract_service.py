"""
Base service: `audited` is a `@contextmanager` that records the action on exit,
`audit()` builds an entry through the module counter.
"""

from __future__ import annotations

from collections.abc import Iterator
from contextlib import contextmanager

from ..concerns.has_audit import HasAudit
from ..contracts.auditable_contract import AuditableContract, AuditEntry, next_entry_id


class AbstractService(AuditableContract, HasAudit):
    def __init__(self, name: str) -> None:
        self.name = name
        self.trail: list[str] = []

    def record(self, action: str) -> None:
        self.trail.append(action)

    def audit_trail(self) -> list[str]:
        return self.trail

    def audit_actor(self) -> str:
        return self.name

    def audit(self, action: str) -> AuditEntry:
        return {"id": next_entry_id(self.audit_actor()), "actor": self.audit_actor(), "action": action}

    @contextmanager
    def audited(self, action: str) -> Iterator["AbstractService"]:
        """`with service.audited("x"):` records "x" once the block exits."""
        try:
            yield self
        finally:
            self.record(action)
