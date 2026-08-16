"""Part usage report."""

from __future__ import annotations

from typing import TYPE_CHECKING

from ..contracts.report_contract import ReportRow, report_row
from ..support.abstract_report import AbstractReport

if TYPE_CHECKING:
    from ..dataset import Dataset


class PartUsageReport(AbstractReport):
    SLUG = "part-usage"

    def __init__(self) -> None:
        super().__init__(self.SLUG, "Part usage")

    def rows(self, data: "Dataset") -> list[ReportRow]:
        return [report_row(part.name, part.consumed_quantity()) for part in data.parts]
