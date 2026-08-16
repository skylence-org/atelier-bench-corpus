"""Profit margin report."""

from __future__ import annotations

from typing import TYPE_CHECKING

from ..contracts.report_contract import ReportRow, report_row
from ..support.abstract_report import AbstractReport

if TYPE_CHECKING:
    from ..dataset import Dataset


class ProfitMarginReport(AbstractReport):
    SLUG = "profit-margin"

    def __init__(self) -> None:
        super().__init__(self.SLUG, "Profit margin")

    def rows(self, data: "Dataset") -> list[ReportRow]:
        rows = []
        for order in data.orders:
            parts = order.parts_subtotal().cents
            labour = order.labor_minutes * 125
            rows.append(report_row(f"order-{order.id}", 0 if parts + labour == 0 else labour / (parts + labour)))
        return rows
