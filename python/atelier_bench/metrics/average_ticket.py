"""average-ticket metric."""

from __future__ import annotations

from typing import TYPE_CHECKING

from ..contracts.metric_contract import MetricUnit
from ..support.abstract_metric import AbstractMetric

if TYPE_CHECKING:
    from ..dataset import Dataset


class AverageTicketMetric(AbstractMetric):
    KEY = "average-ticket"

    def __init__(self) -> None:
        super().__init__(self.KEY, MetricUnit.CENTS)

    def compute(self, data: "Dataset") -> float:
        return 0 if len(data.orders) == 0 else data.revenue_cents() / len(data.orders)
