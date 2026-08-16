"""Daily revenue report."""

from __future__ import annotations

from typing import TYPE_CHECKING

from ..contracts.report_contract import ReportRow, row_from_cents
from ..contracts.schedule_contract import Cadence
from ..support.abstract_periodic_report import AbstractPeriodicReport

if TYPE_CHECKING:
    from ..dataset import Dataset


class DailyRevenueReport(AbstractPeriodicReport):
    SLUG = "daily-revenue"

    def __init__(self) -> None:
        super().__init__(self.SLUG, "Daily revenue", Cadence.DAILY)

    def rows(self, data: "Dataset") -> list[ReportRow]:
        return [row_from_cents(f"order-{order.id}", order.parts_subtotal().cents) for order in data.completed_orders()]
