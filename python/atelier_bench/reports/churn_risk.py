"""Churn risk report."""

from __future__ import annotations

from typing import TYPE_CHECKING

from ..contracts.report_contract import ReportRow, report_row
from ..support.abstract_report import AbstractReport

if TYPE_CHECKING:
    from ..dataset import Dataset


class ChurnRiskReport(AbstractReport):
    SLUG = "churn-risk"

    def __init__(self) -> None:
        super().__init__(self.SLUG, "Churn risk")

    def rows(self, data: "Dataset") -> list[ReportRow]:
        return [
            report_row(customer.name, 1)
            for customer in data.customers
            if all(not order.is_open() for order in data.orders_for(customer.id))
        ]
