"""
Domain events keyed by STRING names. Nothing declares `"repair.completed"` as
a symbol: subscribe and dispatch are connected by the literal alone.
"""

from __future__ import annotations

from collections import defaultdict
from collections.abc import Callable
from typing import Any

REPAIR_COMPLETED = "repair.completed"
STATUS_CHANGED = "status.changed"
STOCK_DEPLETED = "stock.depleted"

Listener = Callable[[dict[str, Any]], None]


def channel_for(event: str, payload: dict[str, Any]) -> str:
    if event == STOCK_DEPLETED:
        return "inventory"
    return f"orders.{payload.get('order_id')}"


class Dispatcher:
    """Fan-out point: `on(name, fn)` / `dispatch(name, payload)`; the name is a plain string."""

    def __init__(self) -> None:
        self._listeners: dict[str, list[Listener]] = defaultdict(list)
        self.seen: list[str] = []

    def on(self, event: str, listener: Listener) -> None:
        self._listeners[event].append(listener)

    def dispatch(self, event: str, payload: dict[str, Any]) -> bool:
        self.seen.append(event)
        listeners = self._listeners.get(event, [])
        for listener in listeners:
            listener(payload)
        return len(listeners) > 0

    def listener_names(self) -> list[str]:
        return sorted(self._listeners)


class SendCompletionNotice:
    """Listener: subscribes with the string literal, not a symbol."""

    def __init__(self) -> None:
        self.name = "send-completion-notice"
        self.sent = 0
        self.last: str | None = None

    def subscribe(self, dispatcher: Dispatcher) -> "SendCompletionNotice":
        dispatcher.on("repair.completed", self.handle)
        return self

    def handle(self, payload: dict[str, Any]) -> None:
        self.sent += 1
        self.last = payload.get("reference")
