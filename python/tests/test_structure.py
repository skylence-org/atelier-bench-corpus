import unittest

from atelier_core import Device, Laptop, TreeNode
from atelier_core.models.repair_order import RepairOrder
from atelier_core.policy import Actor, RepairOrderPolicy
from atelier_core.support.helpers import atelier_parse_reference
from atelier_core.support.pair import Left, Right
from atelier_core.support.pick import first_where
from atelier_core.support.status import RepairStatus


class StructureTest(unittest.TestCase):
    def test_subclass_registry_and_cooperative_super(self) -> None:
        self.assertIs(Device.KINDS["laptop"], Laptop)
        self.assertEqual(Laptop(1, 1, "Framework", "13", "SER-1", 13).label(), 'Framework 13 (SER-1) 13"')

    def test_tree_node_is_self_referential(self) -> None:
        root = TreeNode("root")
        child = root.add_child(TreeNode("child"))
        self.assertEqual(child.depth(), 1)
        self.assertEqual([node.label for node in root.flatten()], ["root", "child"])

    def test_pattern_matching_policy(self) -> None:
        order = RepairOrder.seed(1, 5, 1)
        for status in (RepairStatus.DIAGNOSING, RepairStatus.REPAIRING, RepairStatus.COMPLETED):
            order.transition_to(status, "t")
        policy = RepairOrderPolicy()
        self.assertTrue(policy.can_collect(Actor(5, "customer"), order))
        self.assertFalse(policy.can_collect(Actor(6, "customer"), order))
        self.assertTrue(policy.can_collect(Actor(6, "manager"), order))
        self.assertFalse(policy.can_collect(Actor(6, "technician"), order))

    def test_helpers(self) -> None:
        self.assertEqual(atelier_parse_reference("AT-2026-000042"), ("AT", 2026, 42))
        self.assertIsNone(atelier_parse_reference("nope"))
        self.assertTrue(Left.of("body", "empty").is_left())
        self.assertFalse(Right.of(1).is_left())
        self.assertEqual(first_where([1, 2, 3], lambda n: n > 1), 2)
        self.assertIsNone(first_where([], lambda n: True))


if __name__ == "__main__":
    unittest.main()
