"""Comparable concern mixin."""

from functools import total_ordering


@total_ordering
class ComparableMixin:
    """Adds comparison capability to any class."""

    def get_comparison_key(self):
        """Get the key used for comparison. Subclasses should override."""
        return id(self)

    def __eq__(self, other):
        """Check equality."""
        if not isinstance(other, self.__class__):
            return NotImplemented
        return self.get_comparison_key() == other.get_comparison_key()

    def __lt__(self, other):
        """Check less than."""
        if not isinstance(other, self.__class__):
            return NotImplemented
        return self.get_comparison_key() < other.get_comparison_key()

    def __hash__(self):
        """Get hash."""
        return hash(self.get_comparison_key())
