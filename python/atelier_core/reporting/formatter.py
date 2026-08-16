"""Reporting-side formatter (the other half of the shadow pair)."""

from __future__ import annotations

from ..support.status import RepairStatus


class Formatter:
    def __init__(self, locale: str = "en") -> None:
        self.locale = locale

    def status_line(self, status: RepairStatus, since: str | None = None) -> str:
        label = status.label()
        return label if since is None else f"{label} since {since}"

    def locale_tag(self) -> str:
        return self.locale
