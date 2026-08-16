"""payment-latency service."""

from __future__ import annotations

from typing import TYPE_CHECKING

from ..support.abstract_service import AbstractService

if TYPE_CHECKING:
    from ..dataset import Dataset


class PaymentLatencyService(AbstractService):
    NAME = "payment-latency"

    def __init__(self) -> None:
        super().__init__(self.NAME)

    def days(self, data: "Dataset") -> float:
        return sum(1 for invoice in data.invoices if not invoice.paid) * 3.5
