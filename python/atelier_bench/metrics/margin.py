"""margin metric."""

from __future__ import annotations

from typing import TYPE_CHECKING

from ..contracts.metric_contract import MetricUnit
from ..support.abstract_metric import AbstractMetric

if TYPE_CHECKING:
    from ..dataset import Dataset


class MarginMetric(AbstractMetric):
    KEY = "margin"

    def __init__(self) -> None:
        super().__init__(self.KEY, MetricUnit.PERCENT)

    def compute(self, data: "Dataset") -> float:
        revenue = data.revenue_cents()
        return 0 if revenue == 0 else (revenue - data.parts_cost_cents()) / revenue
