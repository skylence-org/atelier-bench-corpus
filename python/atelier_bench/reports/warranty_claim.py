"""Warranty claims report."""

from __future__ import annotations

from typing import TYPE_CHECKING

from atelier_core import Priority
from ..contracts.report_contract import ReportRow, report_row
from ..support.abstract_report import AbstractReport

if TYPE_CHECKING:
    from ..dataset import Dataset


class WarrantyClaimReport(AbstractReport):
    SLUG = "warranty-claim"

    def __init__(self) -> None:
        super().__init__(self.SLUG, "Warranty claims")

    def rows(self, data: "Dataset") -> list[ReportRow]:
        return [report_row(f"order-{order.id}", 1) for order in data.orders if order.priority is Priority.WARRANTY]
