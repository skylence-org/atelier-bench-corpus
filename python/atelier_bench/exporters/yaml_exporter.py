"""yaml exporter."""

from __future__ import annotations

from collections.abc import Sequence

from ..contracts.report_contract import ReportRow
from ..support.abstract_exporter import AbstractExporter


class YamlExporter(AbstractExporter):
    def __init__(self) -> None:
        super().__init__("yaml", "application/yaml")

    def export(self, rows: Sequence[ReportRow]) -> str:
        return "\n".join(f"- label: {row.label}\n  cents: {row.cents}" for row in rows)
