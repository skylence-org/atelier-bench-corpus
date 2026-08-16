"""part-usage service."""

from __future__ import annotations

from typing import TYPE_CHECKING

from ..support.abstract_service import AbstractService

if TYPE_CHECKING:
    from ..dataset import Dataset


class PartUsageService(AbstractService):
    NAME = "part-usage"

    def __init__(self) -> None:
        super().__init__(self.NAME)

    def consumed_units(self, data: "Dataset") -> int:
        return sum(part.consumed_quantity() for part in data.parts)
