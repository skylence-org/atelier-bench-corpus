//! Completed against still-open order counts.

use crate::contracts::report_contract::{ReportContract, ReportRow};
use crate::dataset::Dataset;
use crate::support::abstract_report::ReportBase;

/// Completed against still-open order counts.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct OrderThroughputReport {
    base: ReportBase,
}

impl OrderThroughputReport {
    /// Registry slug; also the URL segment.
    pub const SLUG: &'static str = "order-throughput";

    pub const fn new() -> Self {
        Self {
            base: ReportBase::new(Self::SLUG, "Order throughput"),
        }
    }

    /// Shared identity and rendering precision.
    pub const fn base(&self) -> &ReportBase {
        &self.base
    }
}

impl Default for OrderThroughputReport {
    fn default() -> Self {
        Self::new()
    }
}

impl ReportContract for OrderThroughputReport {
    fn slug(&self) -> &'static str {
        self.base.slug()
    }

    fn title(&self) -> &'static str {
        self.base.title()
    }

    fn rows(&self, data: &Dataset) -> Vec<ReportRow> {
        vec![
            ReportRow::new("completed", data.completed_orders().len() as f64),
            ReportRow::new("open", data.open_orders().len() as f64),
        ]
    }
}
