"""csv exporter."""

from __future__ import annotations

from collections.abc import Sequence

from ..contracts.report_contract import ReportRow
from ..support.abstract_exporter import AbstractExporter


class CsvExporter(AbstractExporter):
    def __init__(self) -> None:
        super().__init__("csv", "text/csv")

    def export(self, rows: Sequence[ReportRow]) -> str:
        return "\n".join(f"{row.label},{self.format_cents(row.cents)}" for row in rows)
