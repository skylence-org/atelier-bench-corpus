"""CacheableContract: an ABC with concrete defaults (a mixin-shaped contract)."""

from __future__ import annotations

from abc import ABC

DEFAULT_CACHE_TTL_SECONDS = 300


class CacheableContract(ABC):
    cache_namespace: str = "cache"
    slug: str = "anonymous"

    def cache_key(self) -> str:
        return f"{self.cache_namespace}:{self.slug}"

    def ttl_seconds(self) -> int:
        return DEFAULT_CACHE_TTL_SECONDS

    def is_cacheable(self) -> bool:
        return self.ttl_seconds() > 0
