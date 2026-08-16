import unittest

from atelier_core import Money, RepairStatus
from atelier_core.billing.formatter import Formatter as MoneyFormatter
from atelier_core.reporting.formatter import Formatter as StatusFormatter


class ShadowPairTest(unittest.TestCase):
    def test_the_two_formatters_are_unrelated_classes(self) -> None:
        self.assertIsNot(MoneyFormatter, StatusFormatter)
        self.assertEqual(MoneyFormatter.__name__, StatusFormatter.__name__)
        self.assertEqual(MoneyFormatter("EUR").money(Money(34900)), "349.00 EUR")
        self.assertEqual(StatusFormatter().status_line(RepairStatus.COMPLETED, "intake"), "Completed since intake")
        self.assertFalse(hasattr(MoneyFormatter, "status_line"))
        self.assertFalse(hasattr(StatusFormatter, "money"))


if __name__ == "__main__":
    unittest.main()
