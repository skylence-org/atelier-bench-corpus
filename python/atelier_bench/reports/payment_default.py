"""Payment default report."""

from __future__ import annotations

from typing import TYPE_CHECKING

from ..contracts.report_contract import ReportRow, row_from_cents
from ..support.abstract_report import AbstractReport

if TYPE_CHECKING:
    from ..dataset import Dataset


class PaymentDefaultReport(AbstractReport):
    SLUG = "payment-default"

    def __init__(self) -> None:
        super().__init__(self.SLUG, "Payment default")

    def rows(self, data: "Dataset") -> list[ReportRow]:
        return [
            row_from_cents(f"invoice-{invoice.id}", invoice.outstanding().cents)
            for invoice in data.invoices
            if not invoice.paid
        ]
