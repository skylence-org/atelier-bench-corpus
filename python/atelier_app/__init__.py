"""
Application surface: a Flask app whose routes are registered with the
`@app.get(...)` DECORATOR inside `create_app`, plus console commands and jobs.
"""

from __future__ import annotations

from flask import Flask, Response

from .http.api import list_orders, show_registered_report, store_note
from .http.errors import register_error_handlers
from .http.report import show_report
from .state import AppState, seeded_rush_state, seeded_state

__all__ = ["AppState", "create_app", "seeded_rush_state", "seeded_state", "serve"]


def create_app(state: AppState | None = None) -> Flask:
    state = state if state is not None else seeded_state()
    app = Flask("atelier")

    @app.get("/health")
    def health() -> Response:
        return Response("ok", mimetype="text/plain")

    app.get("/report/<reference>")(show_report(state))
    app.get("/api/orders")(list_orders(state))
    app.post("/api/orders/<int:order_id>/notes")(store_note(state))
    app.get("/api/reports/<slug>")(show_registered_report(state))
    register_error_handlers(app)
    return app


def serve(state: AppState, port: int) -> None:
    create_app(state).run(port=port)
