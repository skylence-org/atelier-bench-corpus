"""Signature captured on collection."""

from __future__ import annotations


class Signature:
    def __init__(self, id: int, repair_order_id: int, signed_by: str, svg_path: str = "") -> None:
        self.id = id
        self.repair_order_id = repair_order_id
        self.signed_by = signed_by
        self.svg_path = svg_path

    def is_captured(self) -> bool:
        return self.svg_path != ""
