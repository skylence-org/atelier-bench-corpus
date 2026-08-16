import asyncio
import unittest

from atelier_app.jobs import (
    RecalculateInventory,
    recalculate_inventory,
    recalculate_inventory_async,
    recalculate_inventory_future,
)
from atelier_bench import Dataset
from atelier_core import Dispatcher


class JobsTest(unittest.TestCase):
    def test_three_styles_agree(self) -> None:
        data = Dataset.seeded()
        seen: list[tuple[Exception | None, int]] = []
        recalculate_inventory(data, Dispatcher(), lambda error, count: seen.append((error, count)))
        self.assertEqual(seen, [(None, 1)])
        self.assertEqual(recalculate_inventory_future(data, Dispatcher()).result(), 1)
        self.assertEqual(asyncio.run(recalculate_inventory_async(data, Dispatcher())), "recalculated 1 part(s)")
        self.assertEqual(RecalculateInventory(threshold=10).run(data, Dispatcher()), 4)


if __name__ == "__main__":
    unittest.main()
