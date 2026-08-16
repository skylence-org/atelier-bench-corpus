import unittest

from atelier_bench import Dataset
from atelier_core import Container, IllegalTransitionError, RepairOrder, RepairStatus


class LifecycleTest(unittest.TestCase):
    def test_seeded_order_carries_its_reference(self) -> None:
        order = Dataset.seeded().orders[0]
        self.assertEqual(order.reference(), "AT-2026-000001")
        self.assertEqual(order.short_reference(), "AT1")

    def test_transitions_follow_the_table(self) -> None:
        order = RepairOrder.seed(9, 1, 1)
        self.assertFalse(order.transition_to(RepairStatus.COMPLETED, "test"))
        self.assertTrue(order.transition_to(RepairStatus.DIAGNOSING, "test"))
        self.assertEqual(len(order.log), 1)
        with self.assertRaises(IllegalTransitionError):
            order.complete("test")

    def test_totals_through_both_bindings(self) -> None:
        data = Dataset.seeded()
        self.assertEqual(str(data.orders[0].total(Container.bind_default())), "349.00")
        self.assertEqual(str(data.orders[1].total(Container.bind_rush())), "292.81")
        self.assertEqual(str(data.orders[1].total(Container.bind_default())), "234.25")

    def test_seed_numbers_are_frozen(self) -> None:
        data = Dataset.seeded()
        self.assertEqual(data.revenue_cents(), 58325)
        self.assertEqual(data.parts_cost_cents(), 46300)
        self.assertEqual(data.revenue_cents() - data.parts_cost_cents(), 12025)
        self.assertEqual((len(data.orders), len(data.customers), len(data.parts), len(data.invoices)), (4, 3, 4, 2))
        self.assertEqual(len(list(data)), 4)
        self.assertEqual([order.id for order in data.orders_of(1)], [1, 4])


if __name__ == "__main__":
    unittest.main()
