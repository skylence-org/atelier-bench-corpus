"""Error mapping: domain errors to JSON responses."""

from __future__ import annotations

from flask import Flask, Response, jsonify

from atelier_core import AtelierError


class ApiValidationError(Exception):
    def __init__(self, field: str, message: str) -> None:
        super().__init__(message)
        self.status_code = 422
        self.field = field


def register_error_handlers(app: Flask) -> None:
    @app.errorhandler(ApiValidationError)
    def on_validation(error: ApiValidationError) -> tuple[Response, int]:
        return jsonify({"error": str(error), "field": error.field}), error.status_code

    @app.errorhandler(AtelierError)
    def on_domain(error: AtelierError) -> tuple[Response, int]:
        return jsonify({"error": str(error)}), error.status_code
