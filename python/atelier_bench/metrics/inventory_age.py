"""inventory-age metric."""

from __future__ import annotations

from typing import TYPE_CHECKING

from ..contracts.metric_contract import MetricUnit
from ..support.abstract_metric import AbstractMetric

if TYPE_CHECKING:
    from ..dataset import Dataset


class InventoryAgeMetric(AbstractMetric):
    KEY = "inventory-age"

    def __init__(self) -> None:
        super().__init__(self.KEY, MetricUnit.DAYS)

    def compute(self, data: "Dataset") -> float:
        return sum(part.stock for part in data.parts) / max(len(data.parts), 1)
