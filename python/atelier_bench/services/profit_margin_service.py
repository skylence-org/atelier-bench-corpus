"""profit-margin service."""

from __future__ import annotations

from typing import TYPE_CHECKING

from ..support.abstract_service import AbstractService

if TYPE_CHECKING:
    from ..dataset import Dataset


class ProfitMarginService(AbstractService):
    NAME = "profit-margin"

    def __init__(self) -> None:
        super().__init__(self.NAME)

    def ratio(self, data: "Dataset") -> float:
        revenue = data.revenue_cents()
        return 0.0 if revenue == 0 else (revenue - data.parts_cost_cents()) / revenue
