"""One base class plus two mixins: the one-extends-two-implements shape, spelled as multiple inheritance."""

from __future__ import annotations

from ..concerns.has_audit import HasAudit
from ..concerns.has_metadata import HasMetadataAccess, MetadataBag
from ..contracts.schedule_contract import Cadence
from .abstract_periodic_report import AbstractPeriodicReport


class AbstractCompositeReport(AbstractPeriodicReport, HasAudit, HasMetadataAccess):
    def __init__(self, slug: str, title: str, cadence: Cadence) -> None:
        super().__init__(slug, title, cadence)
        self.trail: list[str] = []
        self.bag = MetadataBag()

    def record(self, action: str) -> None:
        self.trail.append(action)
