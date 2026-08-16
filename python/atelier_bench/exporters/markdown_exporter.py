"""md exporter."""

from __future__ import annotations

from collections.abc import Sequence

from ..contracts.report_contract import ReportRow
from ..support.abstract_exporter import AbstractExporter


class MarkdownExporter(AbstractExporter):
    def __init__(self) -> None:
        super().__init__("md", "text/markdown")

    def export(self, rows: Sequence[ReportRow]) -> str:
        head = ["| label | amount |", "| --- | --- |"]
        body = [f"| {row.label} | {self.format_cents(row.cents)} |" for row in rows]
        return "\n".join(head + body)
