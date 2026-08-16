"""Authorisation policy using structural pattern matching on the actor's role."""

from __future__ import annotations

from dataclasses import dataclass

from .models.repair_order import RepairOrder
from .support.status import RepairStatus


@dataclass(frozen=True)
class Actor:
    id: int
    role: str


class RepairOrderPolicy:
    def can_view(self, actor: Actor, order: RepairOrder) -> bool:
        return actor.id == order.customer_id if actor.role == "customer" else True

    def can_transition(self, actor: Actor, order: RepairOrder) -> bool:
        if order.status.is_terminal():
            return False
        return actor.role != "customer"

    def can_collect(self, actor: Actor, order: RepairOrder) -> bool:
        """`match` with class patterns and guards; no default arm returns False."""
        if order.status is not RepairStatus.COMPLETED:
            return False
        match actor:
            case Actor(role="customer", id=customer_id) if customer_id == order.customer_id:
                return True
            case Actor(role="manager"):
                return True
            case _:
                return False
