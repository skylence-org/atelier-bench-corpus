"""Gross profit report."""

from __future__ import annotations

from typing import TYPE_CHECKING

from ..contracts.report_contract import ReportRow, row_from_cents
from ..support.abstract_report import AbstractReport

if TYPE_CHECKING:
    from ..dataset import Dataset


class GrossProfitReport(AbstractReport):
    SLUG = "gross-profit"

    def __init__(self) -> None:
        super().__init__(self.SLUG, "Gross profit")

    def rows(self, data: "Dataset") -> list[ReportRow]:
        revenue = data.revenue_cents()
        cost = data.parts_cost_cents()
        return [
            row_from_cents("revenue", revenue),
            row_from_cents("part cost", cost),
            row_from_cents("gross profit", revenue - cost),
        ]
