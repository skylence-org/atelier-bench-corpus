"""technician-utilization metric."""

from __future__ import annotations

from typing import TYPE_CHECKING

from ..contracts.metric_contract import MetricUnit
from ..support.abstract_metric import AbstractMetric

if TYPE_CHECKING:
    from ..dataset import Dataset


class TechnicianUtilizationMetric(AbstractMetric):
    KEY = "technician-utilization"

    def __init__(self) -> None:
        super().__init__(self.KEY, MetricUnit.PERCENT)

    def compute(self, data: "Dataset") -> float:
        if len(data.technicians) == 0:
            return 0
        return sum(technician.utilisation() for technician in data.technicians) / len(data.technicians)
