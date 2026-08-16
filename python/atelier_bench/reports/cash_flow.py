"""Cash flow report; also the concrete CompositeContract implementor (three parent contracts through the MRO)."""

from __future__ import annotations

from typing import TYPE_CHECKING

from ..contracts.composite_contract import CompositeContract
from ..contracts.report_contract import ReportRow, row_from_cents
from ..support.abstract_report import AbstractReport

if TYPE_CHECKING:
    from ..dataset import Dataset


class CashFlowReport(AbstractReport, CompositeContract):
    SLUG = "cash-flow"

    def __init__(self) -> None:
        super().__init__(self.SLUG, "Cash flow")

    def rows(self, data: "Dataset") -> list[ReportRow]:
        paid = sum(invoice.total.cents for invoice in data.invoices if invoice.paid)
        outstanding = sum(invoice.outstanding().cents for invoice in data.invoices)
        return [row_from_cents("paid", paid), row_from_cents("outstanding", outstanding)]
