"""Base metric: `formatted` renders compute() with the unit suffix."""

from __future__ import annotations

from typing import TYPE_CHECKING

from ..concerns.has_logging import HasLogging
from ..contracts.metric_contract import MetricContract, MetricUnit, suffix

if TYPE_CHECKING:
    from ..dataset import Dataset


class AbstractMetric(MetricContract, HasLogging):
    def __init__(self, key: str, unit: MetricUnit) -> None:
        self.key = key
        self.unit = unit

    def formatted(self, data: "Dataset") -> str:
        return f"{self.compute(data):.2f}{suffix(self.unit)}"
