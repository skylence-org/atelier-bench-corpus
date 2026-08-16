import unittest

from atelier_core import Money


class MoneyTest(unittest.TestCase):
    def test_arithmetic_and_formatting(self) -> None:
        self.assertEqual(str(Money(19900) + Money(100)), "200.00")
        self.assertEqual(str(-Money(5)), "-0.05")
        self.assertEqual(Money(23425).with_surcharge_bp(2500), Money(29281))
        self.assertEqual(Money.parse("12.5"), Money(1250))
        self.assertEqual(Money.sum([Money(1), Money(2)]), Money(3))
        self.assertTrue(Money(1) < Money(2))

    def test_parse_rejects_garbage(self) -> None:
        with self.assertRaises(ValueError):
            Money.parse("twelve")

    def test_zero_is_a_class_constant(self) -> None:
        self.assertTrue(Money.ZERO.is_zero())
        self.assertEqual(Money.from_cents(0), Money.ZERO)


if __name__ == "__main__":
    unittest.main()
