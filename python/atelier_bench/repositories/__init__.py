"""Repositories."""

from .customer_repository import CustomerRepository
from .inventory_repository import InventoryRepository
from .invoice_repository import InvoiceRepository
from .order_repository import OrderRepository
from .part_repository import PartRepository
from .payment_repository import PaymentRepository
from .technician_repository import TechnicianRepository
from .warranty_repository import WarrantyRepository

__all__ = [
    "CustomerRepository",
    "InventoryRepository",
    "InvoiceRepository",
    "OrderRepository",
    "PartRepository",
    "PaymentRepository",
    "TechnicianRepository",
    "WarrantyRepository",
]
