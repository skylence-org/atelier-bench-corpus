"""pdf exporter."""

from __future__ import annotations

from collections.abc import Sequence

from ..contracts.report_contract import ReportRow
from ..support.abstract_exporter import AbstractExporter


class PdfExporter(AbstractExporter):
    def __init__(self) -> None:
        super().__init__("pdf", "application/pdf")

    def export(self, rows: Sequence[ReportRow]) -> str:
        return f"%PDF-1.7\n% {self.format_count(len(rows))} row(s)\n%%EOF"
