import unittest

from atelier_core.support.intake import (
    CourierIntake,
    IntakeChannelKind,
    IntakeContract,
    IntakeRecord,
    IntakeRouter,
    MailInIntake,
    WalkInIntake,
    channel_summary,
    ledger_for,
    route_intake,
)


class IntakeTest(unittest.TestCase):
    def setUp(self) -> None:
        self.ledger = ledger_for(
            [
                ("at-2026-000041", IntakeChannelKind.MAIL_IN),
                ("at-2026-000042", IntakeChannelKind.MAIL_IN),
                ("at-2026-000043", IntakeChannelKind.WALK_IN),
            ]
        )

    def test_metaclass_methods_answer_on_the_class(self) -> None:
        self.assertEqual(IntakeContract.channel_count(), 4)
        self.assertEqual(IntakeContract.slugs(), ("courier", "mail-in", "on-site", "walk-in"))
        self.assertNotIn("channel_count", vars(IntakeContract))
        self.assertEqual(channel_summary(), "4 channels: courier, mail-in, on-site, walk-in")

    def test_courier_is_a_virtual_subclass(self) -> None:
        self.assertIsInstance(CourierIntake(), IntakeContract)
        self.assertNotIn(IntakeContract, CourierIntake.__mro__)
        self.assertTrue(issubclass(WalkInIntake, IntakeContract))

    def test_enum_missing_hook_answers_legacy_slugs(self) -> None:
        self.assertIs(IntakeChannelKind("walk_in"), IntakeChannelKind.WALK_IN)
        self.assertIs(IntakeChannelKind("walk-in"), IntakeChannelKind.WALK_IN)
        with self.assertRaises(ValueError):
            IntakeChannelKind("pigeon")

    def test_post_init_normalises_the_reference(self) -> None:
        record = IntakeRecord("at-2026-000045", IntakeChannelKind.ON_SITE)
        self.assertEqual(record.reference, "AT-2026-000045")
        self.assertEqual(self.ledger.records[0].reference, "AT-2026-000041")

    def test_calling_the_router_instance_reaches_dunder_call(self) -> None:
        router = IntakeRouter({IntakeChannelKind.WALK_IN: WalkInIntake(), IntakeChannelKind.MAIL_IN: MailInIntake()})
        self.assertEqual(router(IntakeChannelKind.WALK_IN).accept("AT-2026-000046"), "counter AT-2026-000046")
        self.assertEqual(router(IntakeChannelKind.MAIL_IN).accept("AT-2026-000047"), "parcel AT-2026-000047")
        self.assertEqual(route_intake(IntakeChannelKind.COURIER).accept("AT-2026-000048"), "courier AT-2026-000048")

    def test_busiest_kind_is_cached_after_the_first_read(self) -> None:
        first = self.ledger.busiest_kind
        self.assertIs(self.ledger.busiest_kind, first)
        self.assertEqual(first, IntakeChannelKind.MAIL_IN)
        self.assertIn("busiest_kind", vars(self.ledger))
        self.assertEqual(self.ledger.summary(), "3 intake(s), busiest mail-in")


if __name__ == "__main__":
    unittest.main()
