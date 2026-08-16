"""backlog service."""

from __future__ import annotations

from typing import TYPE_CHECKING

from ..support.abstract_service import AbstractService

if TYPE_CHECKING:
    from ..dataset import Dataset


class BacklogService(AbstractService):
    NAME = "backlog"

    def __init__(self) -> None:
        super().__init__(self.NAME)

    def depth(self, data: "Dataset") -> int:
        return len(data.open_orders())
