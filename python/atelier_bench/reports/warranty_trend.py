"""Warranty trend report."""

from __future__ import annotations

from typing import TYPE_CHECKING

from atelier_core import Priority
from ..contracts.report_contract import ReportRow, report_row
from ..support.abstract_report import AbstractReport

if TYPE_CHECKING:
    from ..dataset import Dataset


class WarrantyTrendReport(AbstractReport):
    SLUG = "warranty-trend"

    def __init__(self) -> None:
        super().__init__(self.SLUG, "Warranty trend")

    def rows(self, data: "Dataset") -> list[ReportRow]:
        warranty = sum(1 for order in data.orders if order.priority is Priority.WARRANTY)
        return [report_row("warranty share", 0 if len(data.orders) == 0 else warranty / len(data.orders))]
