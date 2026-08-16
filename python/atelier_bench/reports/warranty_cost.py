"""Warranty cost report."""

from __future__ import annotations

from typing import TYPE_CHECKING

from atelier_core import Priority
from ..contracts.report_contract import ReportRow, row_from_cents
from ..support.abstract_report import AbstractReport

if TYPE_CHECKING:
    from ..dataset import Dataset


class WarrantyCostReport(AbstractReport):
    SLUG = "warranty-cost"

    def __init__(self) -> None:
        super().__init__(self.SLUG, "Warranty cost")

    def rows(self, data: "Dataset") -> list[ReportRow]:
        return [
            row_from_cents(f"order-{order.id}", order.parts_subtotal().cents)
            for order in data.orders
            if order.priority is Priority.WARRANTY
        ]
