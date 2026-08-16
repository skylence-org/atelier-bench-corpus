"""
Breadth subsystem registry.

- `REPORTS` is built from `AbstractReport.REGISTRY` (filled by
  `__init_subclass__` when `atelier_bench.reports` is imported): no list of 24
  constructors exists anywhere.
- `load_report(slug)` uses `importlib.import_module` with an f-string: the
  target module cannot be known statically.
- Module-level `__getattr__` (PEP 562) supplies `RULES` and `RuleRegistry`
  lazily: `atelier_bench.RULES` has no assignment in this file.
"""

from __future__ import annotations

import importlib
from types import ModuleType
from typing import Any

from .contracts.composite_contract import CompositeContract
from .contracts.metric_contract import MetricUnit, suffix
from .contracts.notifier_contract import NotifyError
from .contracts.report_contract import ReportRow, report_row, row_from_cents
from .contracts.rule_contract import is_rule_like
from .contracts.schedule_contract import Cadence
from .dataset import Dataset
from .metrics import (
    AverageTicketMetric,
    FirstFixRateMetric,
    InventoryAgeMetric,
    LaborCostMetric,
    MarginMetric,
    NpsMetric,
    OrdersPerDayMetric,
    OverheadMetric,
    PartCostMetric,
    PartsPerOrderMetric,
    PaymentDelayMetric,
    RepeatCustomerMetric,
    ReturnRateMetric,
    TechnicianUtilizationMetric,
    UpsellRateMetric,
    WarrantyRateMetric,
)
from .reports import REPORT_CLASSES
from .support.abstract_metric import AbstractMetric
from .support.abstract_report import AbstractReport

REPORTS: list[AbstractReport] = [report_class() for report_class in REPORT_CLASSES.values()]
REPORT_SLUGS: list[str] = [entry.slug for entry in REPORTS]

METRICS: list[AbstractMetric] = [
    AverageTicketMetric(),
    FirstFixRateMetric(),
    InventoryAgeMetric(),
    LaborCostMetric(),
    MarginMetric(),
    NpsMetric(),
    OrdersPerDayMetric(),
    OverheadMetric(),
    PartCostMetric(),
    PartsPerOrderMetric(),
    PaymentDelayMetric(),
    RepeatCustomerMetric(),
    ReturnRateMetric(),
    TechnicianUtilizationMetric(),
    UpsellRateMetric(),
    WarrantyRateMetric(),
]


def report(slug: str) -> AbstractReport | None:
    return next((candidate for candidate in REPORTS if candidate.slug == slug), None)


def metric(key: str) -> AbstractMetric | None:
    return next((candidate for candidate in METRICS if candidate.key == key), None)


def load_report(slug: str) -> ModuleType | None:
    """Dynamic import with a runtime-built module name: statically unresolvable on purpose."""
    if slug not in REPORT_SLUGS:
        return None
    return importlib.import_module(f"atelier_bench.reports.{slug.replace('-', '_')}")


def __getattr__(name: str) -> Any:
    """PEP 562: `atelier_bench.RULES` / `atelier_bench.RuleRegistry` resolve here, lazily."""
    if name in ("RULES", "RuleRegistry", "NOMINAL_RULES"):
        from . import rules

        return getattr(rules, name)
    raise AttributeError(f"module {__name__!r} has no attribute {name!r}")


__all__ = [
    "Cadence",
    "CompositeContract",
    "Dataset",
    "METRICS",
    "MetricUnit",
    "NotifyError",
    "REPORTS",
    "REPORT_SLUGS",
    "RULES",
    "ReportRow",
    "RuleRegistry",
    "is_rule_like",
    "load_report",
    "metric",
    "report",
    "report_row",
    "row_from_cents",
    "suffix",
]
