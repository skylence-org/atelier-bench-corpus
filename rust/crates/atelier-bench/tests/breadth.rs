//! Registry, contract and blanket-impl coverage for the breadth subsystem.

use atelier_bench::concerns::has_formatting::HasFormatting;
use atelier_bench::concerns::has_serialization::HasSerialization;
use atelier_bench::contracts::exporter_contract::ExporterContract;
use atelier_bench::contracts::notifier_contract::{NotifierContract, NotifyError};
use atelier_bench::contracts::report_contract::ReportContract;
use atelier_bench::dataset::Dataset;
use atelier_bench::exporters::csv_exporter::CsvExporter;
use atelier_bench::exporters::json_exporter::JsonExporter;
use atelier_bench::notifiers::sms_notifier::SmsNotifier;
use atelier_bench::reports::gross_profit_report::GrossProfitReport;
use atelier_bench::repositories::order_repository::OrderRepository;
use atelier_bench::services::revenue_service::RevenueService;
use atelier_core::contracts::repository::Repository;

#[test]
fn registry_holds_every_component() {
    assert_eq!(atelier_bench::REPORTS.len(), 24);
    assert_eq!(atelier_bench::METRICS.len(), 16);
}

#[test]
fn registry_keys_are_unique() {
    let mut slugs: Vec<&str> = atelier_bench::REPORTS.iter().map(|r| r.slug()).collect();
    slugs.sort_unstable();
    let before = slugs.len();
    slugs.dedup();

    assert_eq!(slugs.len(), before);

    let mut keys: Vec<&str> = atelier_bench::METRICS.iter().map(|m| m.key()).collect();
    keys.sort_unstable();
    let before = keys.len();
    keys.dedup();

    assert_eq!(keys.len(), before);
}

#[test]
fn lookup_by_slug_resolves_through_the_registry() {
    let data = Dataset::seeded();
    let report = atelier_bench::report("part-shortage").expect("registered");

    assert_eq!(report.rows(&data).len(), 2);
    assert!(atelier_bench::report("no-such-report").is_none());
}

#[test]
fn every_report_renders_against_the_seed() {
    let data = Dataset::seeded();

    for report in atelier_bench::REPORTS.iter() {
        let rows = report.rows(&data);
        assert_eq!(report.is_empty(&data), rows.is_empty(), "{}", report.slug());
    }
}

#[test]
fn gross_profit_matches_the_frozen_seed() {
    let data = Dataset::seeded();
    let rows = GrossProfitReport::new().rows(&data);

    assert_eq!(rows[0].cents, 58_325);
    assert_eq!(rows[1].cents, 46_300);
    assert_eq!(rows[2].cents, 12_025);
}

#[test]
fn blanket_formatting_reaches_every_report() {
    let report = GrossProfitReport::new();

    assert_eq!(report.format_value(1.5), "1.50");
    assert_eq!(report.format_label("  spaced  "), "spaced");
}

#[test]
fn blanket_serialization_reaches_report_rows() {
    let data = Dataset::seeded();
    let rows = GrossProfitReport::new().rows(&data);

    assert!(rows.to_json().contains("gross profit"));
}

#[test]
fn exporters_render_the_same_rows_differently() {
    let data = Dataset::seeded();
    let rows = GrossProfitReport::new().rows(&data);

    let csv = CsvExporter::new().export(&rows);
    assert!(csv.starts_with("revenue,583.25"));

    let json = JsonExporter::new().export(&rows);
    assert!(json.contains("\"label\":\"gross profit\""));

    assert_eq!(
        CsvExporter::new().filename("gross-profit"),
        "gross-profit.csv"
    );
}

#[test]
fn sms_notifier_enforces_its_length_cap() {
    let sms = SmsNotifier::default();
    let long = "x".repeat(200);

    assert_eq!(
        sms.send("subject", &long),
        Err(NotifyError::TooLarge("sms", 160))
    );
    assert!(sms.send("subject", "short").is_ok());
}

#[test]
fn unconfigured_notifier_refuses_to_send() {
    let sms = SmsNotifier::new("");

    assert_eq!(sms.send("s", "b"), Err(NotifyError::NotConfigured("sms")));
}

#[test]
fn repository_associated_types_resolve() {
    let repo = OrderRepository::new(Dataset::seeded().orders);

    assert_eq!(repo.count(), 4);
    assert!(repo.find(1).is_some());
    assert!(repo.find(99).is_none());
    assert_eq!(repo.open().len(), 3);
}

#[test]
fn parallel_metric_sweep_covers_the_registry() {
    let data = Dataset::seeded();
    let sweep = RevenueService::new().metric_sweep(&data);

    assert_eq!(sweep.len(), 16);
    assert!(sweep.iter().any(|(key, _)| *key == "part-cost"));
}
