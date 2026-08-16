"""Technician payroll report."""

from __future__ import annotations

from typing import TYPE_CHECKING

from ..contracts.report_contract import ReportRow, row_from_cents
from ..support.abstract_report import AbstractReport

if TYPE_CHECKING:
    from ..dataset import Dataset


class TechnicianPayrollReport(AbstractReport):
    SLUG = "technician-payroll"

    def __init__(self) -> None:
        super().__init__(self.SLUG, "Technician payroll")

    def rows(self, data: "Dataset") -> list[ReportRow]:
        share = (data.labour_minutes() // max(len(data.technicians), 1)) * 125
        return [row_from_cents(technician.name, share) for technician in data.technicians]
