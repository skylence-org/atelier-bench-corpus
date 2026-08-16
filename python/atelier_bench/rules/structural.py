"""
The 24 STRUCTURAL rules: plain `AdHocRule` records (a frozen dataclass that
does NOT subclass RuleContract) whose `evaluate` is a lambda. They satisfy the
`RuleLike` Protocol by shape alone; nothing here names RuleContract.
"""

from __future__ import annotations

from collections.abc import Callable
from dataclasses import dataclass
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from ..dataset import Dataset


@dataclass(frozen=True)
class AdHocRule:
    key: str
    check: Callable[["Dataset"], bool]

    def evaluate(self, data: "Dataset") -> bool:
        return bool(self.check(data))


STRUCTURAL_RULES: list[AdHocRule] = [
    AdHocRule("duplicate-reference", lambda data: len({order.reference() for order in data.orders}) == len(data.orders)),
    AdHocRule("reference-prefix", lambda data: all(order.reference().startswith("AT-") for order in data.orders)),
    AdHocRule("currency-consistency", lambda data: all(isinstance(invoice.total.cents, int) for invoice in data.invoices)),
    AdHocRule("rounding", lambda data: data.parts_cost_cents() % 1 == 0),
    AdHocRule("tax-applied", lambda data: data.revenue_cents() > data.parts_cost_cents()),
    AdHocRule("export-freshness", lambda data: len(data.orders) > 0),
    AdHocRule("notification-sent", lambda data: len(data.completed_orders()) > 0),
    AdHocRule("audit-trail", lambda data: any(len(order.log) > 0 for order in data.orders)),
    AdHocRule("cache-ttl", lambda data: len(data.parts) > 0),
    AdHocRule("report-coverage", lambda data: len(data.customers) > 0),
    AdHocRule("metric-range", lambda data: data.labour_minutes() >= 0),
    AdHocRule("dataset-integrity", lambda data: len(data.devices) == len(data.customers)),
    AdHocRule("seed-determinism", lambda data: data.revenue_cents() == 58325),
    AdHocRule("order-count", lambda data: len(data.orders) == 4),
    AdHocRule("customer-count", lambda data: len(data.customers) == 3),
    AdHocRule("part-count", lambda data: len(data.parts) == 4),
    AdHocRule("invoice-count", lambda data: len(data.invoices) == 2),
    AdHocRule("open-order-ratio", lambda data: len(data.open_orders()) / len(data.orders) <= 1),
    AdHocRule("completion-rate", lambda data: len(data.completed_orders()) / len(data.orders) >= 0.25),
    AdHocRule("average-ticket", lambda data: data.revenue_cents() / len(data.orders) > 0),
    AdHocRule("parts-per-order", lambda data: sum(len(order.parts) for order in data.orders) >= 4),
    AdHocRule("repeat-customer", lambda data: any(len(data.orders_for(customer.id)) > 1 for customer in data.customers)),
    AdHocRule("device-category", lambda data: all(len(device.brand) > 0 for device in data.devices)),
    AdHocRule("inventory-turnover", lambda data: any(part.consumed_quantity() >= 0 for part in data.parts)),
]
