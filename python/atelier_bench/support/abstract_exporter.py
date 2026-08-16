"""Base exporter: format_cents / format_percent / format_count arrive from FormatterContract through the MRO."""

from __future__ import annotations

from ..contracts.exporter_contract import ExporterContract, filename_for
from ..contracts.formatter_contract import FormatterContract


class AbstractExporter(ExporterContract, FormatterContract):
    def __init__(self, extension: str, mime: str) -> None:
        self.extension = extension
        self.mime = mime

    def filename(self, slug: str) -> str:
        return filename_for(slug, self.extension)
