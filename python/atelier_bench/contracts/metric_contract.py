"""MetricContract ABC plus the unit enum and its suffix helper."""

from __future__ import annotations

from abc import ABC, abstractmethod
from enum import Enum
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from ..dataset import Dataset


class MetricUnit(Enum):
    COUNT = "count"
    CENTS = "cents"
    PERCENT = "percent"
    DAYS = "days"


_SUFFIXES = {MetricUnit.COUNT: "", MetricUnit.CENTS: " c", MetricUnit.PERCENT: "%", MetricUnit.DAYS: " d"}


def suffix(unit: MetricUnit) -> str:
    return _SUFFIXES.get(unit, "")


class MetricContract(ABC):
    key: str
    unit: MetricUnit

    @abstractmethod
    def compute(self, data: "Dataset") -> float: ...
