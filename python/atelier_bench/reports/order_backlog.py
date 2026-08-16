"""Order backlog report."""

from __future__ import annotations

from typing import TYPE_CHECKING

from ..contracts.report_contract import ReportRow, report_row
from ..support.abstract_report import AbstractReport

if TYPE_CHECKING:
    from ..dataset import Dataset


class OrderBacklogReport(AbstractReport):
    SLUG = "order-backlog"

    def __init__(self) -> None:
        super().__init__(self.SLUG, "Order backlog")

    def rows(self, data: "Dataset") -> list[ReportRow]:
        counts: dict[str, int] = {}
        for order in data.open_orders():
            label = order.status.label()
            counts[label] = counts.get(label, 0) + 1
        return [report_row(label, count) for label, count in sorted(counts.items())]
