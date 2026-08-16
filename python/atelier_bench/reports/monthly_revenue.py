"""Monthly revenue report."""

from __future__ import annotations

from typing import TYPE_CHECKING

from ..contracts.report_contract import ReportRow, row_from_cents
from ..contracts.schedule_contract import Cadence
from ..support.abstract_composite_report import AbstractCompositeReport

if TYPE_CHECKING:
    from ..dataset import Dataset


class MonthlyRevenueReport(AbstractCompositeReport):
    SLUG = "monthly-revenue"

    def __init__(self) -> None:
        super().__init__(self.SLUG, "Monthly revenue", Cadence.MONTHLY)

    def rows(self, data: "Dataset") -> list[ReportRow]:
        self.record("rendered")
        return [row_from_cents("month to date", data.revenue_cents())]
