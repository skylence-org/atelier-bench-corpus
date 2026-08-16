"""
Background work, written three ways: a callback-style function, a
`concurrent.futures.Future`-returning function, and an `async def` coroutine.
All three end at `RecalculateInventory.run`.
"""

from __future__ import annotations

import asyncio
from collections.abc import Callable
from concurrent.futures import Future, ThreadPoolExecutor

from atelier_bench import Dataset
from atelier_core import STOCK_DEPLETED, Dispatcher


class RecalculateInventory:
    """Recount consumed parts and announce anything that ran dry."""

    DEFAULT_THRESHOLD = 1

    def __init__(self, threshold: int = DEFAULT_THRESHOLD) -> None:
        self.threshold = threshold

    def run(self, data: Dataset, dispatcher: Dispatcher) -> int:
        announced = 0
        for part in data.parts:
            if part.stock > self.threshold:
                continue
            dispatcher.dispatch(STOCK_DEPLETED, {"sku": part.sku})
            announced += 1
        return announced


def recalculate_inventory(data: Dataset, dispatcher: Dispatcher, callback: Callable[[Exception | None, int], None]) -> None:
    """Callback style: `callback(error, count)`, error first."""
    try:
        callback(None, RecalculateInventory().run(data, dispatcher))
    except Exception as error:  # noqa: BLE001 - reported through the callback by design
        callback(error, 0)


def recalculate_inventory_future(data: Dataset, dispatcher: Dispatcher) -> Future[int]:
    """Future style: the work runs on a worker thread; `.result()` joins it."""
    executor = ThreadPoolExecutor(max_workers=1)
    future = executor.submit(RecalculateInventory().run, data, dispatcher)
    executor.shutdown(wait=False)
    return future


async def recalculate_inventory_async(data: Dataset, dispatcher: Dispatcher) -> str:
    """Async style: awaits the future-backed count and renders a line."""
    count = await asyncio.wrap_future(recalculate_inventory_future(data, dispatcher))
    return f"recalculated {count} part(s)"
