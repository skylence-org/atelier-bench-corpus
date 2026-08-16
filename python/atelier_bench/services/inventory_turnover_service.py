"""inventory-turnover service."""

from __future__ import annotations

from typing import TYPE_CHECKING

from ..support.abstract_service import AbstractService

if TYPE_CHECKING:
    from ..dataset import Dataset


class InventoryTurnoverService(AbstractService):
    NAME = "inventory-turnover"

    def __init__(self) -> None:
        super().__init__(self.NAME)

    def for_sku(self, data: "Dataset", sku: str) -> float | None:
        part = data.part(sku)
        if part is None:
            return None
        return 0.0 if part.stock == 0 else part.consumed_quantity() / part.stock
