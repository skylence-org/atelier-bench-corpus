"""Customer lifetime value report."""

from __future__ import annotations

from typing import TYPE_CHECKING

from ..contracts.report_contract import ReportRow, row_from_cents
from ..support.abstract_report import AbstractReport

if TYPE_CHECKING:
    from ..dataset import Dataset


class CustomerLifetimeReport(AbstractReport):
    SLUG = "customer-lifetime"

    def __init__(self) -> None:
        super().__init__(self.SLUG, "Customer lifetime value")

    def rows(self, data: "Dataset") -> list[ReportRow]:
        return [
            row_from_cents(customer.name, sum(order.parts_subtotal().cents for order in data.orders_for(customer.id)))
            for customer in data.customers
        ]
