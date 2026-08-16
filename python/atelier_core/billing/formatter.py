"""
Billing-side formatter.

Shadow pair: `atelier_core.reporting.formatter` exports a class with the same
name and an unrelated method set. Consumers alias at the import site.
"""

from __future__ import annotations

from ..money import Money


class Formatter:
    def __init__(self, currency: str = "EUR") -> None:
        self.currency = currency

    def money(self, amount: Money, currency: str = "") -> str:
        return f"{amount} {currency or self.currency}"

    def line(self, quantity: int, description: str, amount: Money) -> str:
        return f"{quantity} x {description} = {self.money(amount)}"
