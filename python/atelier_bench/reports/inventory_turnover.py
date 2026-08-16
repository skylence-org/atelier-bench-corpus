"""Inventory turnover report."""

from __future__ import annotations

from typing import TYPE_CHECKING

from ..contracts.report_contract import ReportRow, report_row
from ..support.abstract_report import AbstractReport

if TYPE_CHECKING:
    from ..dataset import Dataset


class InventoryTurnoverReport(AbstractReport):
    SLUG = "inventory-turnover"

    def __init__(self) -> None:
        super().__init__(self.SLUG, "Inventory turnover")

    def rows(self, data: "Dataset") -> list[ReportRow]:
        return [
            report_row(part.sku, 0 if part.stock == 0 else part.consumed_quantity() / part.stock) for part in data.parts
        ]
