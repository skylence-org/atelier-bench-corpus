"""JSON API: order listing, note creation with validation, registered reports."""

from __future__ import annotations

from collections.abc import Callable
from typing import Any

from flask import Response, jsonify, request

from atelier_bench import report as find_report
from atelier_core import NotFoundError
from atelier_core.support.pair import Left

from ..state import AppState
from .errors import ApiValidationError


def validate_note(payload: Any) -> Left | None:
    body = payload.get("body") if isinstance(payload, dict) else None
    if not isinstance(body, str) or body.strip() == "":
        return Left.of("body", "note body must not be empty")
    return None


def list_orders(state: AppState) -> Callable[[], Response]:
    def handler() -> Response:
        rows = [
            {
                "id": order.id,
                "reference": order.reference(),
                "status": order.status.value,
                "priority": order.priority.label(),
                "open": order.is_open(),
            }
            for order in state.data.orders
        ]
        return jsonify(rows)

    handler.__name__ = "list_orders_handler"
    return handler


def store_note(state: AppState) -> Callable[[int], tuple[Response, int]]:
    def handler(order_id: int) -> tuple[Response, int]:
        payload = request.get_json(silent=True) or {}
        failure = validate_note(payload)
        if failure is not None:
            raise ApiValidationError(failure.field, failure.reason)
        order = next((candidate for candidate in state.data.orders if candidate.id == order_id), None)
        if order is None:
            raise NotFoundError("repair order", str(order_id))
        return jsonify({"orderId": order.id, "body": payload["body"], "author": payload.get("author", "counter")}), 201

    handler.__name__ = "store_note_handler"
    return handler


def show_registered_report(state: AppState) -> Callable[[str], Response]:
    def handler(slug: str) -> Response:
        entry = find_report(slug)
        if entry is None:
            raise ApiValidationError("slug", f"unknown report {slug}")
        return jsonify([row._asdict() for row in entry.rows(state.data)])

    handler.__name__ = "show_registered_report_handler"
    return handler
