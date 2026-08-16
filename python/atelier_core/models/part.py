"""Part: stock, reorder level and consumption tracking."""

from __future__ import annotations

from ..money import Money


class Part:
    def __init__(self, id: int, sku: str, name: str, unit_price: Money, stock: int = 0, reorder_level: int = 2) -> None:
        self.id = id
        self.sku = sku
        self.name = name
        self.unit_price = unit_price
        self.stock = stock
        self.reorder_level = reorder_level
        self.consumed = 0

    def consumed_quantity(self) -> int:
        return self.consumed

    def is_low_stock(self) -> bool:
        return self.stock <= self.reorder_level

    def extended_price(self, quantity: int) -> Money:
        return self.unit_price * quantity

    def consume(self, quantity: int) -> bool:
        if quantity > self.stock:
            return False
        self.stock -= quantity
        self.consumed += quantity
        return True
