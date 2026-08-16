"""
Repair-atelier domain core (python lane).

This is the BARREL: it re-exports the public surface of the package and
declares nothing itself. Definition lookups through `from atelier_core import
Customer` must land on `atelier_core.models.customer`, never here.

Deliberately NOT re-exported: both halves of the same-name `Formatter` pair
(`atelier_core.billing.formatter` / `atelier_core.reporting.formatter`) and
the `Left`/`Right` sibling pair — consumers import those from their modules and
alias them at the import site.
"""

from .container import Container
from .errors import AtelierError, IllegalTransitionError, NotFoundError, ValidationError
from .events import (
    REPAIR_COMPLETED,
    STATUS_CHANGED,
    STOCK_DEPLETED,
    Dispatcher,
    SendCompletionNotice,
    channel_for,
)
from .models.customer import Customer
from .models.device import Device, Laptop
from .models.invoice import Invoice
from .models.label import Label
from .models.note import NotableKind, Note
from .models.part import Part
from .models.repair_order import RepairOrder
from .models.signature import Signature
from .models.technician import Technician, make_technician
from .money import Money
from .observers import AuditingDeviceObserver
from .policy import RepairOrderPolicy
from .services.rush_invoice_calculator import RushInvoiceCalculator
from .services.standard_invoice_calculator import StandardInvoiceCalculator
from .support.helpers import (
    ATELIER_REF_PREFIX,
    ATELIER_REF_WIDTH,
    atelier_format_reference,
    atelier_parse_reference,
)
from .support.priority import Priority
from .support.reference import Reference
from .support.schedule import Schedule
from .support.status import RepairStatus
from .support.tree_node import TreeNode

__all__ = [
    "ATELIER_REF_PREFIX",
    "ATELIER_REF_WIDTH",
    "AtelierError",
    "AuditingDeviceObserver",
    "Container",
    "Customer",
    "Device",
    "Dispatcher",
    "IllegalTransitionError",
    "Invoice",
    "Label",
    "Laptop",
    "Money",
    "NotFoundError",
    "NotableKind",
    "Note",
    "Part",
    "Priority",
    "REPAIR_COMPLETED",
    "Reference",
    "RepairOrder",
    "RepairOrderPolicy",
    "RepairStatus",
    "RushInvoiceCalculator",
    "STATUS_CHANGED",
    "STOCK_DEPLETED",
    "Schedule",
    "SendCompletionNotice",
    "Signature",
    "StandardInvoiceCalculator",
    "Technician",
    "TreeNode",
    "ValidationError",
    "atelier_format_reference",
    "atelier_parse_reference",
    "channel_for",
    "make_technician",
]
