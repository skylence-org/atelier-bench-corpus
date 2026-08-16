"""Label with a polymorphic join table."""

from __future__ import annotations

from typing import TypedDict


class LabelJoin(TypedDict):
    """`TypedDict`: keys are declared as class-body annotations."""

    label_id: int
    kind: str
    record_id: int


class Label:
    def __init__(self, id: int, name: str, colour: str = "slate") -> None:
        self.id = id
        self.name = name
        self.colour = colour

    def attached_ids(self, joins: list[LabelJoin], kind: str) -> list[int]:
        return [join["record_id"] for join in joins if join["label_id"] == self.id and join["kind"] == kind]
