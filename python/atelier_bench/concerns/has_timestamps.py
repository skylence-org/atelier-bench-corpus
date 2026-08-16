"""Frozen timestamps: no wall clock in the corpus seed path."""

from __future__ import annotations

from datetime import datetime, timedelta, timezone


class Stamped:
    FROZEN_EPOCH_SECONDS = 1784188800

    def __init__(self, payload: object, created: datetime | None = None) -> None:
        self.payload = payload
        self.created = created or datetime.fromtimestamp(self.FROZEN_EPOCH_SECONDS, tz=timezone.utc)

    def created_at(self) -> datetime:
        return self.created

    def updated_at(self) -> datetime | None:
        return None

    def age_seconds(self, now: datetime) -> int:
        return int((now - self.created).total_seconds())

    def expires_at(self, ttl: int) -> datetime:
        return self.created + timedelta(seconds=ttl)
