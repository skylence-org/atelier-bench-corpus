"""xlsx exporter."""

from __future__ import annotations

from collections.abc import Sequence

from ..contracts.report_contract import ReportRow
from ..support.abstract_exporter import AbstractExporter


class XlsxExporter(AbstractExporter):
    def __init__(self) -> None:
        super().__init__("xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")

    def export(self, rows: Sequence[ReportRow]) -> str:
        return ";".join(f"A{index}={row.label} B{index}={row.cents}" for index, row in enumerate(rows, start=1))
