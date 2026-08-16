"""CacheableContract ABC and its error type."""

from abc import ABC, abstractmethod


class CacheError(Exception):
    """Base error for cache contract violations."""


class CacheableContract(ABC):
    """Nominal parent for cacheable operations."""

    @abstractmethod
    def cache_key(self) -> str:
        """Generate a cache key for this operation."""
        pass

    @abstractmethod
    def is_cached(self) -> bool:
        """Check if result is in cache."""
        pass

    @abstractmethod
    def invalidate(self) -> None:
        """Invalidate the cache."""
        pass
