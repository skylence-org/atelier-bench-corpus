"""
Reference behaviour supplied two ways:

- `HasReference` is a MIXIN CLASS: models list it as a base and inherit
  `reference()` / `short_reference()` through the MRO.
- `with_reference` is a CLASS DECORATOR that copies the same methods onto a
  class with `setattr` (the `Object.assign` shape): the decorated class has no
  textual declaration of `reference()` and no `HasReference` in its bases.
"""

from __future__ import annotations

from typing import Any, Callable, TypeVar

from ..support.helpers import ATELIER_REF_PREFIX, atelier_format_reference

DEFAULT_REFERENCE_PREFIX = ATELIER_REF_PREFIX

C = TypeVar("C", bound=type)


class HasReference:
    """Mixin: `reference_prefix` / `reference_number` are supplied by the host class."""

    reference_prefix: str = DEFAULT_REFERENCE_PREFIX
    reference_number: int = 0

    def reference(self) -> str:
        return atelier_format_reference(self.reference_prefix, self.reference_number)

    def short_reference(self) -> str:
        return f"{self.reference_prefix}{self.reference_number}"


def with_reference(prefix: str = DEFAULT_REFERENCE_PREFIX) -> Callable[[C], C]:
    """Class decorator: graft the HasReference methods onto `target` via setattr."""

    def decorate(target: C) -> C:
        for name, member in vars(HasReference).items():
            if callable(member) and not name.startswith("__"):
                setattr(target, name, member)
        setattr(target, "reference_prefix", prefix)
        setattr(target, "reference_number", 0)
        return target

    return decorate


def reference_of(model: Any) -> str:
    """Duck-typed: anything with reference() qualifies, mixin or decorated."""
    return model.reference()
