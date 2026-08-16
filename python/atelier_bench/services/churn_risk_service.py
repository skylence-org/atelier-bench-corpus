"""churn-risk service."""

from __future__ import annotations

from typing import TYPE_CHECKING

from ..support.abstract_service import AbstractService

if TYPE_CHECKING:
    from ..dataset import Dataset


class ChurnRiskService(AbstractService):
    NAME = "churn-risk"

    def __init__(self) -> None:
        super().__init__(self.NAME)

    def at_risk(self, data: "Dataset") -> list[int]:
        return [
            customer.id
            for customer in data.customers
            if all(not order.is_open() for order in data.orders_for(customer.id))
        ]
