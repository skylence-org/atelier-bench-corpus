"""order-volume service."""

from __future__ import annotations

from typing import TYPE_CHECKING

from ..support.abstract_service import AbstractService

if TYPE_CHECKING:
    from ..dataset import Dataset


class OrderVolumeService(AbstractService):
    NAME = "order-volume"

    def __init__(self) -> None:
        super().__init__(self.NAME)

    def total(self, data: "Dataset") -> int:
        return len(data.orders)

    def for_customer(self, data: "Dataset", customer_id: int) -> int:
        return len(data.orders_for(customer_id))

    def by(self, data: "Dataset", scope: str) -> int:
        """String-keyed dispatch: the method name is built at runtime."""
        handler = getattr(self, f"scope_{scope}")
        return int(handler(data))

    def scope_open(self, data: "Dataset") -> int:
        return len(data.open_orders())

    def scope_completed(self, data: "Dataset") -> int:
        return len(data.completed_orders())
