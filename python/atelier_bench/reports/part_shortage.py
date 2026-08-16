"""Part shortage report."""

from __future__ import annotations

from typing import TYPE_CHECKING

from ..contracts.report_contract import ReportRow, report_row
from ..support.abstract_report import AbstractReport

if TYPE_CHECKING:
    from ..dataset import Dataset


class PartShortageReport(AbstractReport):
    SLUG = "part-shortage"

    def __init__(self) -> None:
        super().__init__(self.SLUG, "Part shortage")

    def rows(self, data: "Dataset") -> list[ReportRow]:
        return [report_row(part.sku, part.stock) for part in data.low_stock_parts()]
