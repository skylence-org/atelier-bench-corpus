"""Payment latency report."""

from __future__ import annotations

from typing import TYPE_CHECKING

from ..contracts.report_contract import ReportRow, report_row
from ..support.abstract_report import AbstractReport

if TYPE_CHECKING:
    from ..dataset import Dataset


class PaymentLatencyReport(AbstractReport):
    SLUG = "payment-latency"

    def __init__(self) -> None:
        super().__init__(self.SLUG, "Payment latency")

    def rows(self, data: "Dataset") -> list[ReportRow]:
        return [report_row(f"invoice-{invoice.id}", 0 if invoice.paid else invoice.id * 3.5) for invoice in data.invoices]
