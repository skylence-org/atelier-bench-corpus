"""throughput service."""

from __future__ import annotations

from typing import TYPE_CHECKING

from ..support.abstract_service import AbstractService

if TYPE_CHECKING:
    from ..dataset import Dataset


class ThroughputService(AbstractService):
    NAME = "throughput"

    def __init__(self) -> None:
        super().__init__(self.NAME)

    def completed(self, data: "Dataset") -> int:
        return len(data.completed_orders())
