"""payment-delay metric."""

from __future__ import annotations

from typing import TYPE_CHECKING

from ..contracts.metric_contract import MetricUnit
from ..support.abstract_metric import AbstractMetric

if TYPE_CHECKING:
    from ..dataset import Dataset


class PaymentDelayMetric(AbstractMetric):
    KEY = "payment-delay"

    def __init__(self) -> None:
        super().__init__(self.KEY, MetricUnit.DAYS)

    def compute(self, data: "Dataset") -> float:
        return sum(1 for invoice in data.invoices if not invoice.paid) * 3.5
