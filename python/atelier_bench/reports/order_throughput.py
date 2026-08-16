"""Order throughput report."""

from __future__ import annotations

from typing import TYPE_CHECKING

from ..contracts.report_contract import ReportRow, report_row
from ..support.abstract_report import AbstractReport

if TYPE_CHECKING:
    from ..dataset import Dataset


class OrderThroughputReport(AbstractReport):
    SLUG = "order-throughput"

    def __init__(self) -> None:
        super().__init__(self.SLUG, "Order throughput")

    def rows(self, data: "Dataset") -> list[ReportRow]:
        return [report_row("completed", len(data.completed_orders())), report_row("open", len(data.open_orders()))]
