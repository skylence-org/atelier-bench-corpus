"""warranty-claim service."""

from __future__ import annotations

from typing import TYPE_CHECKING

from atelier_core import Priority

from ..support.abstract_service import AbstractService

if TYPE_CHECKING:
    from ..dataset import Dataset


class WarrantyClaimService(AbstractService):
    NAME = "warranty-claim"

    def __init__(self) -> None:
        super().__init__(self.NAME)

    def count(self, data: "Dataset") -> int:
        return sum(1 for order in data.orders if order.priority is Priority.WARRANTY)
