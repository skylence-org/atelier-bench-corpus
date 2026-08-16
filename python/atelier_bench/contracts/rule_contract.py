"""RuleContract ABC, RuleLike Protocol, and their error type."""

from abc import ABC, abstractmethod
from typing import Protocol


class RuleError(Exception):
    """Base error for rule contract violations."""


class RuleContract(ABC):
    """Nominal parent for rule engines."""

    @abstractmethod
    def evaluate(self, context) -> bool:
        """Evaluate the rule against a context."""
        pass

    @abstractmethod
    def apply(self, target) -> None:
        """Apply the rule to a target."""
        pass


class RuleLike(Protocol):
    """Structural protocol for rule-like objects.
    
    Requires only a read-only key property so frozen dataclasses satisfy it.
    """

    @property
    def key(self) -> str:
        """The unique key identifying this rule."""
        ...
