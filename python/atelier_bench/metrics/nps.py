"""nps metric."""

from __future__ import annotations

from typing import TYPE_CHECKING

from ..contracts.metric_contract import MetricUnit
from ..support.abstract_metric import AbstractMetric

if TYPE_CHECKING:
    from ..dataset import Dataset


class NpsMetric(AbstractMetric):
    KEY = "nps"

    def __init__(self) -> None:
        super().__init__(self.KEY, MetricUnit.COUNT)

    def compute(self, data: "Dataset") -> float:
        return len(data.customers) * 8.5
