"""html exporter."""

from __future__ import annotations

from collections.abc import Sequence

from ..contracts.report_contract import ReportRow
from ..support.abstract_exporter import AbstractExporter


class HtmlExporter(AbstractExporter):
    def __init__(self) -> None:
        super().__init__("html", "text/html")

    def export(self, rows: Sequence[ReportRow]) -> str:
        body = "".join(f"<tr><td>{row.label}</td><td>{self.format_cents(row.cents)}</td></tr>" for row in rows)
        return f"<table>{body}</table>"
