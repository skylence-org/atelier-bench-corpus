"""
Base for every report. `__init_subclass__` auto-registers each CONCRETE
subclass by its SLUG at class-creation time (`AbstractReport.REGISTRY`), so
the report registry has no hand-written list of 24 constructors.
"""

from __future__ import annotations

from collections.abc import Callable
from typing import cast

from ..concerns.has_cache import HasCache
from ..contracts.cacheable_contract import CacheableContract
from ..contracts.report_contract import ReportContract
from .abstract_component import AbstractComponent


class AbstractReport(ReportContract, CacheableContract, HasCache, AbstractComponent):
    DEFAULT_DECIMALS = 2
    SLUG = ""
    REGISTRY: dict[str, Callable[[], "AbstractReport"]] = {}

    def __init_subclass__(cls, **kwargs: object) -> None:
        super().__init_subclass__(**kwargs)
        if cls.SLUG:
            AbstractReport.REGISTRY[cls.SLUG] = cast(Callable[[], "AbstractReport"], cls)

    def __init__(self, slug: str, title: str) -> None:
        super().__init__(slug, title)
        self.decimals = self.DEFAULT_DECIMALS
        self.cache_namespace = "reports"
