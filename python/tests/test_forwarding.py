import unittest

from atelier_core import Customer, RepairOrder, make_technician
from atelier_core.concerns.has_reference import HasReference, reference_of
from atelier_core.support.schedule import Schedule


class ForwardingTest(unittest.TestCase):
    def test_technician_forwards_unknown_attributes_to_its_schedule(self) -> None:
        technician = make_technician(1, "Nel", Schedule(2))
        self.assertEqual(technician.next_slot(), 0)
        self.assertTrue(technician.book_slot(0))
        self.assertEqual(technician.booked_count(), 1)
        self.assertEqual(technician.utilisation(), 0.5)
        self.assertNotIn("next_slot", vars(type(technician)))
        with self.assertRaises(AttributeError):
            technician.no_such_thing()

    def test_capacity_writes_through_the_property_setter(self) -> None:
        technician = make_technician(2, "Ada", Schedule(4))
        self.assertTrue(technician.book_slot(0))
        self.assertTrue(technician.book_slot(1))
        self.assertEqual(technician.set_capacity(1), 2)
        self.assertEqual(technician.schedule.capacity, 2)

    def test_reference_arrives_two_ways(self) -> None:
        customer = Customer.seed(7, "x", "x@y")
        order = RepairOrder.seed(7, 1, 1)
        self.assertIsInstance(customer, HasReference)
        self.assertNotIsInstance(order, HasReference)
        self.assertEqual(customer.reference(), "CU-2026-000007")
        self.assertEqual(reference_of(customer), "CU-2026-000007")
        self.assertEqual(reference_of(order), "AT-2026-000007")
        self.assertNotIn("reference", RepairOrder.__dict__.keys() - {"reference", "short_reference"})


if __name__ == "__main__":
    unittest.main()
