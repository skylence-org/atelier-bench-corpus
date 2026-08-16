"""Metadata bag and the access mixin that reads it."""

from __future__ import annotations

from typing import Any


class MetadataBag:
    def __init__(self) -> None:
        self.entries: dict[str, Any] = {}

    def set(self, key: str, value: Any) -> "MetadataBag":
        self.entries[key] = value
        return self

    def metadata(self) -> dict[str, Any]:
        return self.entries

    def meta(self, key: str) -> Any:
        return self.entries.get(key)

    def meta_keys(self) -> list[str]:
        return list(self.entries)


class HasMetadataAccess:
    bag: MetadataBag

    def metadata(self) -> dict[str, Any]:
        return getattr(self, "bag", MetadataBag()).metadata()

    def meta(self, key: str) -> Any:
        return self.metadata().get(key)

    def meta_keys(self) -> list[str]:
        return list(self.metadata())
