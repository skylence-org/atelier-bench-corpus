"""
Report package barrel: importing it defines all 24 concrete report classes, and
`AbstractReport.__init_subclass__` registers each one by SLUG as a side effect
of the class statement running. `REPORT_CLASSES` is that registry, in module
order; nothing here lists 24 constructors by hand.
"""

from __future__ import annotations

from collections.abc import Callable

from ..support.abstract_report import AbstractReport

from .cash_flow import CashFlowReport
from .churn_risk import ChurnRiskReport
from .customer_lifetime import CustomerLifetimeReport
from .customer_retention import CustomerRetentionReport
from .daily_revenue import DailyRevenueReport
from .gross_profit import GrossProfitReport
from .inventory_turnover import InventoryTurnoverReport
from .monthly_revenue import MonthlyRevenueReport
from .net_margin import NetMarginReport
from .order_backlog import OrderBacklogReport
from .order_throughput import OrderThroughputReport
from .order_volume import OrderVolumeReport
from .part_shortage import PartShortageReport
from .part_usage import PartUsageReport
from .payment_default import PaymentDefaultReport
from .payment_latency import PaymentLatencyReport
from .profit_margin import ProfitMarginReport
from .technician_efficiency import TechnicianEfficiencyReport
from .technician_load import TechnicianLoadReport
from .technician_payroll import TechnicianPayrollReport
from .warranty_claim import WarrantyClaimReport
from .warranty_cost import WarrantyCostReport
from .warranty_trend import WarrantyTrendReport
from .weekly_revenue import WeeklyRevenueReport

REPORT_CLASSES: dict[str, Callable[[], AbstractReport]] = dict(AbstractReport.REGISTRY)

__all__ = ["REPORT_CLASSES"] + [
    "CashFlowReport",
    "ChurnRiskReport",
    "CustomerLifetimeReport",
    "CustomerRetentionReport",
    "DailyRevenueReport",
    "GrossProfitReport",
    "InventoryTurnoverReport",
    "MonthlyRevenueReport",
    "NetMarginReport",
    "OrderBacklogReport",
    "OrderThroughputReport",
    "OrderVolumeReport",
    "PartShortageReport",
    "PartUsageReport",
    "PaymentDefaultReport",
    "PaymentLatencyReport",
    "ProfitMarginReport",
    "TechnicianEfficiencyReport",
    "TechnicianLoadReport",
    "TechnicianPayrollReport",
    "WarrantyClaimReport",
    "WarrantyCostReport",
    "WarrantyTrendReport",
    "WeeklyRevenueReport",
]
