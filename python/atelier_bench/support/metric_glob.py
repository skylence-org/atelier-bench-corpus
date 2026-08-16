"""
Star import: `from ..metrics import *` brings in exactly the 16 names the
metrics package lists in `__all__`; only one is used here.
"""

from __future__ import annotations

from typing import TYPE_CHECKING

from ..metrics import *  # noqa: F403 - the point of this module

if TYPE_CHECKING:
    from ..dataset import Dataset


def margin_percent(data: "Dataset") -> str:
    return MarginMetric().formatted(data)  # noqa: F405 - arrives through the star import
