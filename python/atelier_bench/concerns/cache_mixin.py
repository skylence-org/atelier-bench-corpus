"""Cache concern mixin."""


class CacheMixin:
    """Adds caching capability to any class."""

    def __init__(self):
        self._cache = {}

    def set_cache(self, key: str, value) -> None:
        """Store a value in cache."""
        self._cache[key] = value

    def get_cache(self, key: str):
        """Retrieve a value from cache."""
        return self._cache.get(key)

    def has_cache(self, key: str) -> bool:
        """Check if key is in cache."""
        return key in self._cache

    def clear_cache(self, key: str | None = None) -> None:
        """Clear cache entry or entire cache."""
        if key is None:
            self._cache.clear()
        elif key in self._cache:
            del self._cache[key]
