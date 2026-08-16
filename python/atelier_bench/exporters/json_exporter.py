"""json exporter."""

from __future__ import annotations

import json
from collections.abc import Sequence

from ..contracts.report_contract import ReportRow
from ..support.abstract_exporter import AbstractExporter


class JsonExporter(AbstractExporter):
    def __init__(self) -> None:
        super().__init__("json", "application/json")

    def export(self, rows: Sequence[ReportRow]) -> str:
        return json.dumps([row._asdict() for row in rows], separators=(",", ":"))
