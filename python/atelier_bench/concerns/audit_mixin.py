"""Audit concern mixin."""

from datetime import datetime


class AuditMixin:
    """Adds audit trail capability to any class."""

    def __init__(self):
        self._audit_trail = []

    def audit(self, action: str, details: str = "") -> None:
        """Record an audit entry."""
        entry = {
            "timestamp": datetime.utcnow().isoformat(),
            "action": action,
            "details": details,
        }
        self._audit_trail.append(entry)

    def get_audit_trail(self) -> list[dict]:
        """Get all audit entries."""
        return self._audit_trail.copy()

    def clear_audit_trail(self) -> None:
        """Clear the audit trail."""
        self._audit_trail.clear()
