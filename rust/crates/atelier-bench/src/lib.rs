//! Breadth subsystem for the rust lane.
//!
//! Deliberately wide and shallow: eight contracts, eight reusable concerns,
//! seven shared bases and ~76 small implementors. The point is fan-in and
//! fan-out -- one contract with two dozen implementors, one base type reached
//! from every component -- not domain depth.

pub mod concerns;
pub mod contracts;
pub mod dataset;
pub mod exporters;
pub mod metrics;
pub mod notifiers;
pub mod reports;
pub mod repositories;
pub mod services;
pub mod support;

use crate::contracts::metric_contract::MetricContract;
use crate::contracts::report_contract::ReportContract;
use once_cell::sync::Lazy;

pub use crate::dataset::Dataset;

/// Every report in the lane, in registry order.
///
/// The widest fan-in site in the corpus: a `references` request on
/// [`ReportContract`] must account for all 24 entries below.
pub static REPORTS: Lazy<Vec<Box<dyn ReportContract>>> = Lazy::new(|| {
    vec![
        Box::new(reports::cash_flow_report::CashFlowReport::new()),
        Box::new(reports::churn_risk_report::ChurnRiskReport::new()),
        Box::new(reports::customer_lifetime_report::CustomerLifetimeReport::new()),
        Box::new(reports::customer_retention_report::CustomerRetentionReport::new()),
        Box::new(reports::daily_revenue_report::DailyRevenueReport::new()),
        Box::new(reports::gross_profit_report::GrossProfitReport::new()),
        Box::new(reports::inventory_turnover_report::InventoryTurnoverReport::new()),
        Box::new(reports::monthly_revenue_report::MonthlyRevenueReport::new()),
        Box::new(reports::net_margin_report::NetMarginReport::new()),
        Box::new(reports::order_backlog_report::OrderBacklogReport::new()),
        Box::new(reports::order_throughput_report::OrderThroughputReport::new()),
        Box::new(reports::order_volume_report::OrderVolumeReport::new()),
        Box::new(reports::part_shortage_report::PartShortageReport::new()),
        Box::new(reports::part_usage_report::PartUsageReport::new()),
        Box::new(reports::payment_default_report::PaymentDefaultReport::new()),
        Box::new(reports::payment_latency_report::PaymentLatencyReport::new()),
        Box::new(reports::profit_margin_report::ProfitMarginReport::new()),
        Box::new(reports::technician_efficiency_report::TechnicianEfficiencyReport::new()),
        Box::new(reports::technician_load_report::TechnicianLoadReport::new()),
        Box::new(reports::technician_payroll_report::TechnicianPayrollReport::new()),
        Box::new(reports::warranty_claim_report::WarrantyClaimReport::new()),
        Box::new(reports::warranty_cost_report::WarrantyCostReport::new()),
        Box::new(reports::warranty_trend_report::WarrantyTrendReport::new()),
        Box::new(reports::weekly_revenue_report::WeeklyRevenueReport::new()),
    ]
});

/// Every metric in the lane, in registry order.
pub static METRICS: Lazy<Vec<Box<dyn MetricContract>>> = Lazy::new(|| {
    vec![
        Box::new(metrics::average_ticket_metric::AverageTicketMetric::new()),
        Box::new(metrics::first_fix_rate_metric::FirstFixRateMetric::new()),
        Box::new(metrics::inventory_age_metric::InventoryAgeMetric::new()),
        Box::new(metrics::labor_cost_metric::LaborCostMetric::new()),
        Box::new(metrics::margin_metric::MarginMetric::new()),
        Box::new(metrics::nps_metric::NpsMetric::new()),
        Box::new(metrics::orders_per_day_metric::OrdersPerDayMetric::new()),
        Box::new(metrics::overhead_metric::OverheadMetric::new()),
        Box::new(metrics::part_cost_metric::PartCostMetric::new()),
        Box::new(metrics::parts_per_order_metric::PartsPerOrderMetric::new()),
        Box::new(metrics::payment_delay_metric::PaymentDelayMetric::new()),
        Box::new(metrics::repeat_customer_metric::RepeatCustomerMetric::new()),
        Box::new(metrics::return_rate_metric::ReturnRateMetric::new()),
        Box::new(metrics::technician_utilization_metric::TechnicianUtilizationMetric::new()),
        Box::new(metrics::upsell_rate_metric::UpsellRateMetric::new()),
        Box::new(metrics::warranty_rate_metric::WarrantyRateMetric::new()),
    ]
});

/// Look a report up by its slug.
pub fn report(slug: &str) -> Option<&'static dyn ReportContract> {
    REPORTS
        .iter()
        .find(|report| report.slug() == slug)
        .map(|report| report.as_ref())
}

/// Look a metric up by its key.
pub fn metric(key: &str) -> Option<&'static dyn MetricContract> {
    METRICS
        .iter()
        .find(|metric| metric.key() == key)
        .map(|metric| metric.as_ref())
}
