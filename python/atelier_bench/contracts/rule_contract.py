"""
Two faces of one contract:

- `RuleContract` is an ABC — the 24 NOMINAL rules subclass it (`class X(RuleContract)`).
- `RuleLike` is a `Protocol` — the 24 STRUCTURAL rules are plain objects that
  merely have `.key` and `.evaluate(data)`; nothing in their source names the
  contract. `is_rule_like` is the runtime check for both.
"""

from __future__ import annotations

from abc import ABC, abstractmethod
from typing import TYPE_CHECKING, Protocol, runtime_checkable

if TYPE_CHECKING:
    from ..dataset import Dataset


class RuleContract(ABC):
    key: str

    @abstractmethod
    def evaluate(self, data: "Dataset") -> bool: ...


@runtime_checkable
class RuleLike(Protocol):
    @property
    def key(self) -> str: ...

    def evaluate(self, data: "Dataset") -> bool: ...


def is_rule_like(candidate: object) -> bool:
    return isinstance(candidate, RuleLike)
