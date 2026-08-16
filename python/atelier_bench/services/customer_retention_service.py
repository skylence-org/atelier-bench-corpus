"""customer-retention service."""

from __future__ import annotations

from typing import TYPE_CHECKING

from ..support.abstract_service import AbstractService

if TYPE_CHECKING:
    from ..dataset import Dataset


class CustomerRetentionService(AbstractService):
    NAME = "customer-retention"

    def __init__(self) -> None:
        super().__init__(self.NAME)

    def rate(self, data: "Dataset") -> float:
        if len(data.customers) == 0:
            return 0.0
        repeat = sum(1 for customer in data.customers if len(data.orders_for(customer.id)) > 1)
        return repeat / len(data.customers)
