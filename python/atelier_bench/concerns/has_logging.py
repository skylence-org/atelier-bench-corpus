"""Logging mixin: `log_target` reads whichever identity attribute the host has."""

from __future__ import annotations


class HasLogging:
    def log_target(self) -> str:
        for attribute in ("slug", "key", "name"):
            value = getattr(self, attribute, None)
            if value:
                return str(value)
        return "component"

    def log_line(self, message: str) -> str:
        return f"[{self.log_target()}] {message}"
