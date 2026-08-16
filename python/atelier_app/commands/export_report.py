"""
Export a report through an exporter chosen by a STRING key: the exporter
module is loaded with importlib from a table, so the edge from `format` to the
class is name-only.
"""

from __future__ import annotations

import importlib

from atelier_bench import report as find_report

from ..state import AppState

EXPORTER_MODULES = {
    "csv": ("atelier_bench.exporters.csv_exporter", "CsvExporter"),
    "json": ("atelier_bench.exporters.json_exporter", "JsonExporter"),
    "md": ("atelier_bench.exporters.markdown_exporter", "MarkdownExporter"),
}


def export_report(state: AppState, slug: str, fmt: str = "csv") -> str:
    entry = find_report(slug)
    if entry is None:
        raise ValueError(f"unknown report {slug}")
    if fmt not in EXPORTER_MODULES:
        raise ValueError(f"unknown export format {fmt}")
    module_name, class_name = EXPORTER_MODULES[fmt]
    exporter_class = getattr(importlib.import_module(module_name), class_name)
    return str(exporter_class().export(entry.rows(state.data)))
