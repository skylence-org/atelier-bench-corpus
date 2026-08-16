"""Audit-trail mixin reading the host's `trail` list."""

from __future__ import annotations


def last_audit_of(trail: list[str]) -> str | None:
    return trail[-1] if trail else None


class HasAudit:
    trail: list[str]

    def audit_trail(self) -> list[str]:
        return getattr(self, "trail", [])

    def last_audit(self) -> str | None:
        return last_audit_of(self.audit_trail())

    def audit_depth(self) -> int:
        return len(self.audit_trail())
