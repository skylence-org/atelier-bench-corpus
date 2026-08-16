"""
Console command `recalculate`. NOTE: this module exports a function named
`recalculate_inventory` and so does `..jobs` — two different functions, same
name, told apart only by module path.
"""

from __future__ import annotations

import asyncio

from atelier_core import Dispatcher, SendCompletionNotice

from ..jobs import recalculate_inventory_async
from ..state import AppState


def recalculate_inventory(state: AppState) -> str:
    dispatcher = Dispatcher()
    SendCompletionNotice().subscribe(dispatcher)
    return asyncio.run(recalculate_inventory_async(state.data, dispatcher))
