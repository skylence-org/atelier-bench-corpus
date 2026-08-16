"""Net margin report."""

from __future__ import annotations

from typing import TYPE_CHECKING

from ..contracts.report_contract import ReportRow, report_row
from ..support.abstract_report import AbstractReport

if TYPE_CHECKING:
    from ..dataset import Dataset


class NetMarginReport(AbstractReport):
    SLUG = "net-margin"

    def __init__(self) -> None:
        super().__init__(self.SLUG, "Net margin")

    def rows(self, data: "Dataset") -> list[ReportRow]:
        revenue = data.revenue_cents()
        return [report_row("net margin", 0 if revenue == 0 else (revenue - data.parts_cost_cents()) / revenue)]
