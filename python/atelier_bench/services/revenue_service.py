"""revenue service."""

from __future__ import annotations

from typing import TYPE_CHECKING

from ..support.abstract_service import AbstractService

if TYPE_CHECKING:
    from ..dataset import Dataset


class RevenueService(AbstractService):
    NAME = "revenue"

    def __init__(self) -> None:
        super().__init__(self.NAME)

    def total_cents(self, data: "Dataset") -> int:
        return data.revenue_cents()

    def metric_sweep(self, data: "Dataset") -> list[tuple[str, float]]:
        from .. import METRICS  # late import: the registry imports this module first

        return [(metric.key, metric.compute(data)) for metric in METRICS]
