"""technician-load service."""

from __future__ import annotations

from typing import TYPE_CHECKING

from ..support.abstract_service import AbstractService

if TYPE_CHECKING:
    from ..dataset import Dataset


class TechnicianLoadService(AbstractService):
    NAME = "technician-load"

    def __init__(self) -> None:
        super().__init__(self.NAME)

    def mean_utilisation(self, data: "Dataset") -> float:
        if len(data.technicians) == 0:
            return 0.0
        return sum(technician.utilisation() for technician in data.technicians) / len(data.technicians)
