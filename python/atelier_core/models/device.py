"""
Device and Laptop: `__init_subclass__` keeps a registry of every subclass at
class-creation time (the metaclass-lite pattern), and Laptop uses cooperative
`super()` in both `__init__` and `label()`.
"""

from __future__ import annotations


class Device:
    """Base device; every subclass is recorded in `Device.KINDS` when defined."""

    KINDS: dict[str, type["Device"]] = {}

    def __init_subclass__(cls, **kwargs: object) -> None:
        super().__init_subclass__(**kwargs)
        Device.KINDS[cls.__name__.lower()] = cls

    def __init__(self, id: int, customer_id: int, brand: str, model: str, serial: str | None = None) -> None:
        self.id = id
        self.customer_id = customer_id
        self.brand = brand
        self.model = model
        self.serial = serial

    def label(self) -> str:
        return f"{self.brand} {self.model}" if self.serial is None else f"{self.brand} {self.model} ({self.serial})"

    def is_warranty_eligible(self) -> bool:
        return self.serial is not None


class Laptop(Device):
    def __init__(
        self, id: int, customer_id: int, brand: str, model: str, serial: str | None, screen_inches: int
    ) -> None:
        super().__init__(id, customer_id, brand, model, serial)
        self.screen_inches = screen_inches

    def label(self) -> str:
        return f'{super().label()} {self.screen_inches}"'
