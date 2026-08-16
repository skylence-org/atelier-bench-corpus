"""overhead metric."""

from __future__ import annotations

from typing import TYPE_CHECKING

from ..contracts.metric_contract import MetricUnit
from ..support.abstract_metric import AbstractMetric

if TYPE_CHECKING:
    from ..dataset import Dataset


class OverheadMetric(AbstractMetric):
    KEY = "overhead"

    def __init__(self) -> None:
        super().__init__(self.KEY, MetricUnit.CENTS)

    def compute(self, data: "Dataset") -> float:
        return data.parts_cost_cents() * 0.15
