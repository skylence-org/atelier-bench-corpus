"""
Application state. The two same-name `Formatter` classes are imported from
their modules and ALIASED here; nothing downstream sees the bare name.
"""

from __future__ import annotations

from dataclasses import dataclass, replace

from atelier_bench import Dataset
from atelier_core import Container
from atelier_core.billing.formatter import Formatter as MoneyFormatter
from atelier_core.reporting.formatter import Formatter as StatusFormatter


@dataclass(frozen=True)
class AppState:
    container: Container
    data: Dataset
    money: MoneyFormatter
    status: StatusFormatter


def seeded_state() -> AppState:
    return AppState(
        container=Container.bind_default(),
        data=Dataset.seeded(),
        money=MoneyFormatter("EUR"),
        status=StatusFormatter("en"),
    )


def seeded_rush_state() -> AppState:
    return replace(seeded_state(), container=Container.bind_rush())
