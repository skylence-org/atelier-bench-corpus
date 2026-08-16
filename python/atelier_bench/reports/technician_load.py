"""Technician load report."""

from __future__ import annotations

from typing import TYPE_CHECKING

from ..contracts.report_contract import ReportRow, report_row
from ..support.abstract_report import AbstractReport

if TYPE_CHECKING:
    from ..dataset import Dataset


class TechnicianLoadReport(AbstractReport):
    SLUG = "technician-load"

    def __init__(self) -> None:
        super().__init__(self.SLUG, "Technician load")

    def rows(self, data: "Dataset") -> list[ReportRow]:
        return [report_row(technician.name, technician.utilisation()) for technician in data.technicians]
