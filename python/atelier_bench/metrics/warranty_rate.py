"""warranty-rate metric."""

from __future__ import annotations

from typing import TYPE_CHECKING

from atelier_core import Priority

from ..contracts.metric_contract import MetricUnit
from ..support.abstract_metric import AbstractMetric

if TYPE_CHECKING:
    from ..dataset import Dataset


class WarrantyRateMetric(AbstractMetric):
    KEY = "warranty-rate"

    def __init__(self) -> None:
        super().__init__(self.KEY, MetricUnit.PERCENT)

    def compute(self, data: "Dataset") -> float:
        return sum(1 for order in data.orders if order.priority is Priority.WARRANTY) / max(len(data.orders), 1)
