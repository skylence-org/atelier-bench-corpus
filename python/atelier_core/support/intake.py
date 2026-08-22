"""
Intake channels: how a device reaches the atelier (walk-in, mail-in, on-site, courier).

Six python-only edges live here and nowhere else in the lane:

* `IntakeMeta`, a metaclass whose methods answer on the CLASS object and are declared in no class body;
* a `register()` call that makes the courier channel a virtual subclass with no base and no inheritance edge;
* `IntakeChannelKind._missing_`, the Enum hook that answers a lookup no member value matches;
* `IntakeRecord.__post_init__`, run by the dataclass-generated `__init__` and called by name nowhere;
* `IntakeRouter.__call__`, reached by calling the instance, so no call site spells the name;
* `IntakeLedger.busiest_kind`, a `functools.cached_property`.

The `IntakeChannel` alias is deliberate: virtual registration is a runtime edge that static
typing does not follow, so the courier channel has to be named in the union by hand.
"""

from __future__ import annotations

from abc import ABCMeta, abstractmethod
from collections.abc import Mapping, Sequence
from dataclasses import dataclass
from enum import Enum
from functools import cached_property


class IntakeChannelKind(str, Enum):
    WALK_IN = "walk-in"
    MAIL_IN = "mail-in"
    ON_SITE = "on-site"
    COURIER = "courier"

    @classmethod
    def _missing_(cls, value: object) -> IntakeChannelKind | None:
        """Legacy slugs such as walk_in reach a member through this hook; no member assignment carries them."""
        if isinstance(value, str):
            return cls.__members__.get(value.upper().replace("-", "_"))
        return None


class IntakeMeta(ABCMeta):
    """Metaclass: both methods below answer on the class object and appear in no class body."""

    def channel_count(cls) -> int:
        return len(_CHANNELS)

    def slugs(cls) -> tuple[str, ...]:
        return tuple(sorted(kind.value for kind in _CHANNELS))


class IntakeContract(metaclass=IntakeMeta):
    """Every channel accepts a reference and answers with the line the front desk prints."""

    slug: str

    @abstractmethod
    def accept(self, reference: str) -> str: ...


class WalkInIntake(IntakeContract):
    slug = "walk-in"

    def accept(self, reference: str) -> str:
        return f"counter {reference}"


class MailInIntake(IntakeContract):
    slug = "mail-in"

    def accept(self, reference: str) -> str:
        return f"parcel {reference}"


class OnSiteIntake(IntakeContract):
    slug = "on-site"

    def accept(self, reference: str) -> str:
        return f"visit {reference}"


class CourierIntake:
    """No base class: the registration below makes it a virtual subclass, so isinstance says yes and the class statement says nothing."""

    slug = "courier"

    def accept(self, reference: str) -> str:
        return f"courier {reference}"


IntakeContract.register(CourierIntake)

IntakeChannel = IntakeContract | CourierIntake


@dataclass
class IntakeRecord:
    reference: str
    kind: IntakeChannelKind
    note: str = ""

    def __post_init__(self) -> None:
        """The generated __init__ calls this; nothing in the lane calls it by name."""
        self.reference = self.reference.upper()


_CHANNELS: Mapping[IntakeChannelKind, IntakeChannel] = {
    IntakeChannelKind.WALK_IN: WalkInIntake(),
    IntakeChannelKind.MAIL_IN: MailInIntake(),
    IntakeChannelKind.ON_SITE: OnSiteIntake(),
    IntakeChannelKind.COURIER: CourierIntake(),
}


class IntakeRouter:
    """Callable instance: `router(kind)` runs the dunder below, and no call site spells its name."""

    def __init__(self, channels: Mapping[IntakeChannelKind, IntakeChannel]) -> None:
        self._channels = channels

    def __call__(self, kind: IntakeChannelKind) -> IntakeChannel:
        return self._channels[kind]

    def kinds(self) -> tuple[IntakeChannelKind, ...]:
        return tuple(self._channels)


class IntakeLedger:
    """One day of intake records; the busiest channel is counted once and cached on the instance."""

    def __init__(self, records: Sequence[IntakeRecord]) -> None:
        self.records = list(records)

    @cached_property
    def busiest_kind(self) -> IntakeChannelKind:
        """Counted on the first read and cached in the instance dict: the second read never runs this body."""
        tally: dict[IntakeChannelKind, int] = {}
        for record in self.records:
            tally[record.kind] = tally.get(record.kind, 0) + 1
        if not tally:
            return IntakeChannelKind.WALK_IN
        return max(tally, key=lambda kind: (tally[kind], kind.value))

    def summary(self) -> str:
        return f"{len(self.records)} intake(s), busiest {self.busiest_kind.value}"


DEFAULT_ROUTER = IntakeRouter(_CHANNELS)


def ledger_for(rows: Sequence[tuple[str, IntakeChannelKind]]) -> IntakeLedger:
    """Builds the records the dataclass normalises on construction."""
    return IntakeLedger([IntakeRecord(reference, kind) for reference, kind in rows])


def route_intake(kind: IntakeChannelKind) -> IntakeChannel:
    """Module entry point: calls the router INSTANCE, which is the only way the dunder is reached."""
    return DEFAULT_ROUTER(kind)


def channel_summary() -> str:
    """Both names below come from IntakeMeta; neither is declared in the contract's body."""
    return f"{IntakeContract.channel_count()} channels: {', '.join(IntakeContract.slugs())}"
