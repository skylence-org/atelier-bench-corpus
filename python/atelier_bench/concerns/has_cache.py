"""Cache-key mixin."""

from __future__ import annotations

from ..contracts.cacheable_contract import DEFAULT_CACHE_TTL_SECONDS


class HasCache:
    cache_namespace: str = "reports"

    def cache_key_for(self, suffix: str) -> str:
        return f"{self.cache_namespace}:{suffix}"

    def cache_ttl(self) -> int:
        return DEFAULT_CACHE_TTL_SECONDS
