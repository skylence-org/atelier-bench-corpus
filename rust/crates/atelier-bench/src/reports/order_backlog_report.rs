//! Open orders grouped by lifecycle state.

use crate::contracts::report_contract::{ReportContract, ReportRow};
use crate::dataset::Dataset;
use crate::support::abstract_report::ReportBase;
use itertools::Itertools;

/// Open orders grouped by lifecycle state.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct OrderBacklogReport {
    base: ReportBase,
}

impl OrderBacklogReport {
    /// Registry slug; also the URL segment.
    pub const SLUG: &'static str = "order-backlog";

    pub const fn new() -> Self {
        Self {
            base: ReportBase::new(Self::SLUG, "Order backlog"),
        }
    }

    /// Shared identity and rendering precision.
    pub const fn base(&self) -> &ReportBase {
        &self.base
    }
}

impl Default for OrderBacklogReport {
    fn default() -> Self {
        Self::new()
    }
}

impl ReportContract for OrderBacklogReport {
    fn slug(&self) -> &'static str {
        self.base.slug()
    }

    fn title(&self) -> &'static str {
        self.base.title()
    }

    fn rows(&self, data: &Dataset) -> Vec<ReportRow> {
        data.open_orders()
            .iter()
            .map(|order| order.status.label())
            .counts()
            .into_iter()
            .sorted_by_key(|(label, _)| *label)
            .map(|(label, count)| ReportRow::new(label, count as f64))
            .collect()
    }
}
