import unittest

from atelier_core import REPAIR_COMPLETED, Dispatcher, SendCompletionNotice, channel_for


class EventsTest(unittest.TestCase):
    def test_string_named_events_reach_the_listener(self) -> None:
        dispatcher = Dispatcher()
        listener = SendCompletionNotice().subscribe(dispatcher)
        self.assertTrue(dispatcher.dispatch(REPAIR_COMPLETED, {"reference": "AT-2026-000001"}))
        self.assertFalse(dispatcher.dispatch("stock.depleted", {"sku": "X"}))
        self.assertEqual((listener.sent, listener.last), (1, "AT-2026-000001"))
        self.assertEqual(dispatcher.seen, ["repair.completed", "stock.depleted"])
        self.assertEqual(dispatcher.listener_names(), ["repair.completed"])
        self.assertEqual(channel_for("stock.depleted", {}), "inventory")
        self.assertEqual(channel_for("repair.completed", {"order_id": 4}), "orders.4")


if __name__ == "__main__":
    unittest.main()
