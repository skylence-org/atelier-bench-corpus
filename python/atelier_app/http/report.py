"""
Customer-facing report endpoint.

Live call path for the shadow pair: `state.money` and `state.status` are two
different `Formatter` classes reached through the aliases in `..state`.
"""

from __future__ import annotations

from collections.abc import Callable
from typing import TypedDict

from flask import Response, jsonify

from atelier_core import NotFoundError

from ..state import AppState


class ReportView(TypedDict):
    reference: str
    customer: str
    device: str
    status: str
    total: str
    calculator: str


def show_report(state: AppState) -> Callable[[str], Response]:
    """Look an order up by its formatted reference, then render it."""

    def handler(reference: str) -> Response:
        order = next((candidate for candidate in state.data.orders if candidate.reference() == reference), None)
        if order is None:
            raise NotFoundError("repair order", reference)
        customer = next((c for c in state.data.customers if c.id == order.customer_id), None)
        device = next((d for d in state.data.devices if d.id == order.device_id), None)
        view: ReportView = {
            "reference": reference,
            "customer": customer.display_name() if customer is not None else "",
            "device": device.label() if device is not None else "",
            "status": state.status.status_line(order.status, "intake"),
            "total": state.money.money(order.total(state.container), "EUR"),
            "calculator": state.container.invoice_calculator().name,
        }
        return jsonify(view)

    handler.__name__ = "show_report_handler"
    return handler
