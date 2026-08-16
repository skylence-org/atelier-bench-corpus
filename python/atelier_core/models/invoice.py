"""Invoice: a total, a paid flag, and `outstanding()` returning Money.ZERO once paid."""

from __future__ import annotations

from ..money import Money


class Invoice:
    def __init__(self, id: int, repair_order_id: int, total: Money) -> None:
        self.id = id
        self.repair_order_id = repair_order_id
        self.total = total
        self.paid = False

    def mark_paid(self) -> bool:
        if self.paid:
            return False
        self.paid = True
        return True

    def outstanding(self) -> Money:
        return Money.ZERO if self.paid else self.total
