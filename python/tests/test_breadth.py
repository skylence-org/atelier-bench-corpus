import unittest

import atelier_bench
from atelier_bench import METRICS, REPORTS, Dataset, load_report, metric, report
from atelier_bench.concerns.has_formatting import formatting, is_formatting
from atelier_bench.contracts.composite_contract import CompositeContract
from atelier_bench.contracts.formatter_contract import format_cell
from atelier_bench.contracts.rule_contract import RuleContract, is_rule_like
from atelier_bench.exporters import CsvExporter, JsonExporter, MarkdownExporter
from atelier_bench.notifiers import EmailNotifier, SmsNotifier
from atelier_bench.contracts.notifier_contract import NotifyError
from atelier_bench.reports.cash_flow import CashFlowReport
from atelier_bench.reports.monthly_revenue import MonthlyRevenueReport
from atelier_bench.repositories import OrderRepository, TechnicianRepository
from atelier_bench.services import OrderVolumeService, RevenueService
from atelier_bench.support.abstract_report import AbstractReport
from atelier_bench.support.metric_glob import margin_percent
from atelier_core import Money


class BreadthTest(unittest.TestCase):
    def setUp(self) -> None:
        self.data = Dataset.seeded()

    def test_registry_counts(self) -> None:
        self.assertEqual(len(REPORTS), 24)
        self.assertEqual(len(METRICS), 16)
        self.assertEqual(len(atelier_bench.RULES), 48)
        self.assertEqual(len(AbstractReport.REGISTRY), 24)
        self.assertEqual(sum(isinstance(rule, RuleContract) for rule in atelier_bench.RULES), 24)
        self.assertEqual(sum(is_rule_like(rule) for rule in atelier_bench.RULES), 48)
        self.assertEqual(len(atelier_bench.RuleRegistry.satisfied(self.data)), 48)

    def test_every_report_and_metric_runs_on_the_seed(self) -> None:
        for entry in REPORTS:
            entry.rows(self.data)
        self.assertEqual([row.cents for row in report("gross-profit").rows(self.data)], [58325, 46300, 12025])
        self.assertEqual(metric("margin").formatted(self.data), "0.21%")
        self.assertEqual(margin_percent(self.data), "0.21%")
        self.assertEqual(load_report("cash-flow").__name__, "atelier_bench.reports.cash_flow")
        self.assertIsNone(load_report("nope"))

    def test_multi_parent_shapes(self) -> None:
        self.assertEqual(CashFlowReport.__mro__.index(CompositeContract) > 0, True)
        self.assertEqual(CashFlowReport().parents(), ("ReportContract", "CacheableContract", "ScheduleContract"))
        monthly = MonthlyRevenueReport()
        monthly.rows(self.data)
        self.assertEqual(monthly.audit_trail(), ["rendered"])
        self.assertEqual(monthly.next_run_seconds(90000), 2592000)
        self.assertEqual(monthly.meta_keys(), [])

    def test_exporters_notifiers_repositories_services(self) -> None:
        rows = report("gross-profit").rows(self.data)
        self.assertEqual(CsvExporter().export(rows).splitlines()[0], "revenue,583.25")
        self.assertIn('"cents":58325', JsonExporter().export(rows))
        self.assertTrue(MarkdownExporter().export(rows).startswith("| label | amount |"))
        self.assertEqual(format_cell(Money(5)), "0.05")
        self.assertEqual(format_cell(2.5), "2.50")
        email = EmailNotifier()
        self.assertEqual(email.send("s", "b"), {"channel": "email", "reference": "email:s"})
        self.assertEqual(email.sent_count(), 1)
        self.assertEqual(email.describe_all(["a"]), ["email:a EMAIL:a"])
        with self.assertRaises(NotifyError):
            SmsNotifier().send("x" * 100, "y" * 100)
        self.assertFalse(SmsNotifier("").is_valid())
        self.assertEqual(OrderRepository(self.data.orders).count(), 4)
        self.assertEqual(len(TechnicianRepository(self.data.technicians).available()), 3)
        revenue = RevenueService()
        with revenue.audited("sweep"):
            self.assertEqual(len(revenue.metric_sweep(self.data)), 16)
        self.assertEqual(revenue.audit_trail(), ["sweep"])
        self.assertEqual(OrderVolumeService().by(self.data, "open"), 3)
        self.assertTrue(is_formatting(formatting))


if __name__ == "__main__":
    unittest.main()
