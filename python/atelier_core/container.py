"""Minimal DI container: which InvoiceCalculator answers `calculate` is decided here, not at the call site."""

from __future__ import annotations

from .contracts.invoice_calculator import InvoiceCalculator
from .services.rush_invoice_calculator import RushInvoiceCalculator
from .services.standard_invoice_calculator import StandardInvoiceCalculator


class Container:
    def __init__(self, calculator: InvoiceCalculator) -> None:
        self._calculator = calculator

    @classmethod
    def bind_default(cls) -> "Container":
        return cls(StandardInvoiceCalculator())

    @classmethod
    def bind_rush(cls) -> "Container":
        return cls(RushInvoiceCalculator())

    @classmethod
    def with_invoice_calculator(cls, calculator: InvoiceCalculator) -> "Container":
        return cls(calculator)

    def invoice_calculator(self) -> InvoiceCalculator:
        return self._calculator
