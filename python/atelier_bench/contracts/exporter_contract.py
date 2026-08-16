"""ExporterContract ABC and the filename helper."""

from __future__ import annotations

from abc import ABC, abstractmethod
from collections.abc import Sequence

from .report_contract import ReportRow


def filename_for(slug: str, extension: str) -> str:
    return f"{slug}.{extension}"


class ExporterContract(ABC):
    extension: str
    mime: str

    @abstractmethod
    def export(self, rows: Sequence[ReportRow]) -> str: ...
