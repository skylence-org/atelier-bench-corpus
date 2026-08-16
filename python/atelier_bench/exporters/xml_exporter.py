"""xml exporter."""

from __future__ import annotations

from collections.abc import Sequence

from ..contracts.report_contract import ReportRow
from ..support.abstract_exporter import AbstractExporter


class XmlExporter(AbstractExporter):
    def __init__(self) -> None:
        super().__init__("xml", "application/xml")

    def export(self, rows: Sequence[ReportRow]) -> str:
        body = "".join(f'<row label="{row.label}" cents="{row.cents}"/>' for row in rows)
        return f"<rows>{body}</rows>"
