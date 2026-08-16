"""repeat-customer metric."""

from __future__ import annotations

from typing import TYPE_CHECKING

from ..contracts.metric_contract import MetricUnit
from ..support.abstract_metric import AbstractMetric

if TYPE_CHECKING:
    from ..dataset import Dataset


class RepeatCustomerMetric(AbstractMetric):
    KEY = "repeat-customer"

    def __init__(self) -> None:
        super().__init__(self.KEY, MetricUnit.PERCENT)

    def compute(self, data: "Dataset") -> float:
        if len(data.customers) == 0:
            return 0
        return sum(1 for customer in data.customers if len(data.orders_for(customer.id)) > 1) / len(data.customers)
