"""ReportContract: an ABC every report descends from; ReportRow is a NamedTuple."""

from __future__ import annotations

from abc import ABC, abstractmethod
from typing import TYPE_CHECKING, NamedTuple

if TYPE_CHECKING:
    from ..dataset import Dataset


class ReportRow(NamedTuple):
    label: str
    value: float
    cents: int


def report_row(label: str, value: float) -> ReportRow:
    return ReportRow(label, value, round(value * 100))


def row_from_cents(label: str, cents: int) -> ReportRow:
    return ReportRow(label, cents / 100, cents)


class ReportContract(ABC):
    """The widest contract in the lane: two dozen concrete descendants."""

    slug: str
    title: str

    @abstractmethod
    def rows(self, data: "Dataset") -> list[ReportRow]: ...

    def total(self, data: "Dataset") -> float:
        return sum(row.value for row in self.rows(data))

    def is_empty(self, data: "Dataset") -> bool:
        return len(self.rows(data)) == 0
