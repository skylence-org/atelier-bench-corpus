"""Observer that audits device lifecycle events into lines."""

from __future__ import annotations

from .models.device import Device


class AuditingDeviceObserver:
    def __init__(self) -> None:
        self.lines: list[str] = []

    def created(self, device: Device) -> None:
        self.lines.append(f"device.created {device.label()}")

    def deleted(self, device: Device) -> None:
        self.lines.append(f"device.deleted {device.label()}")
