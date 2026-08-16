"""
Rule registry: 24 nominal classes (subclass RuleContract) + 24 structural
AdHocRule objects (Protocol-only) = 48 rules. `RuleRegistry` is the fan-in.
"""

from __future__ import annotations

from typing import TYPE_CHECKING, Any

from ..contracts.rule_contract import RuleLike
from .structural import STRUCTURAL_RULES
from .minimum_stock import MinimumStockRule
from .maximum_backlog import MaximumBacklogRule
from .warranty_window import WarrantyWindowRule
from .rush_surcharge import RushSurchargeRule
from .technician_capacity import TechnicianCapacityRule
from .part_availability import PartAvailabilityRule
from .invoice_balance import InvoiceBalanceRule
from .customer_credit import CustomerCreditRule
from .device_age import DeviceAgeRule
from .repair_duration import RepairDurationRule
from .rework_limit import ReworkLimitRule
from .discount_ceiling import DiscountCeilingRule
from .deposit_required import DepositRequiredRule
from .label_presence import LabelPresenceRule
from .note_required import NoteRequiredRule
from .signature_required import SignatureRequiredRule
from .priority_escalation import PriorityEscalationRule
from .status_sequence import StatusSequenceRule
from .part_cost_margin import PartCostMarginRule
from .revenue_floor import RevenueFloorRule
from .gross_profit import GrossProfitRule
from .schedule_gap import ScheduleGapRule
from .slot_overbooking import SlotOverbookingRule
from .idle_technician import IdleTechnicianRule

if TYPE_CHECKING:
    from ..dataset import Dataset

NOMINAL_CLASSES: list[type[Any]] = [
    MinimumStockRule,
    MaximumBacklogRule,
    WarrantyWindowRule,
    RushSurchargeRule,
    TechnicianCapacityRule,
    PartAvailabilityRule,
    InvoiceBalanceRule,
    CustomerCreditRule,
    DeviceAgeRule,
    RepairDurationRule,
    ReworkLimitRule,
    DiscountCeilingRule,
    DepositRequiredRule,
    LabelPresenceRule,
    NoteRequiredRule,
    SignatureRequiredRule,
    PriorityEscalationRule,
    StatusSequenceRule,
    PartCostMarginRule,
    RevenueFloorRule,
    GrossProfitRule,
    ScheduleGapRule,
    SlotOverbookingRule,
    IdleTechnicianRule,
]
NOMINAL_KEYS = [rule_class.KEY for rule_class in NOMINAL_CLASSES]
NOMINAL_RULES: list[RuleLike] = [rule_class() for rule_class in NOMINAL_CLASSES]
RULES: list[RuleLike] = [*NOMINAL_RULES]
RULES.extend(STRUCTURAL_RULES)


class RuleRegistry:
    RULES = RULES

    @staticmethod
    def rule(key: str) -> RuleLike | None:
        return next((candidate for candidate in RULES if candidate.key == key), None)

    @staticmethod
    def satisfied(data: "Dataset") -> list[str]:
        return [rule.key for rule in RULES if rule.evaluate(data)]
