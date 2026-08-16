"""Customer retention report."""

from __future__ import annotations

from typing import TYPE_CHECKING

from ..contracts.report_contract import ReportRow, report_row
from ..support.abstract_report import AbstractReport

if TYPE_CHECKING:
    from ..dataset import Dataset


class CustomerRetentionReport(AbstractReport):
    SLUG = "customer-retention"

    def __init__(self) -> None:
        super().__init__(self.SLUG, "Customer retention")

    def rows(self, data: "Dataset") -> list[ReportRow]:
        rows = [report_row(customer.name, len(data.orders_for(customer.id))) for customer in data.customers]
        return [row for row in rows if row.value > 1]
