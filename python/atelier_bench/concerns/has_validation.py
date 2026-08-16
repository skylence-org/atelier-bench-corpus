"""Validation mixin: `validate` is the hook subclasses override."""

from __future__ import annotations

from typing import TypedDict


class Violation(TypedDict):
    field: str
    message: str


class HasValidation:
    def validate(self) -> list[Violation]:
        return []

    def is_valid(self) -> bool:
        return len(self.validate()) == 0

    def first_violation(self) -> Violation | None:
        violations = self.validate()
        return violations[0] if violations else None
