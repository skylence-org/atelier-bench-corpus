//! Orders grouped by intake priority.

use crate::contracts::report_contract::{ReportContract, ReportRow};
use crate::dataset::Dataset;
use crate::support::abstract_report::ReportBase;
use itertools::Itertools;

/// Orders grouped by intake priority.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct OrderVolumeReport {
    base: ReportBase,
}

impl OrderVolumeReport {
    /// Registry slug; also the URL segment.
    pub const SLUG: &'static str = "order-volume";

    pub const fn new() -> Self {
        Self {
            base: ReportBase::new(Self::SLUG, "Order volume"),
        }
    }

    /// Shared identity and rendering precision.
    pub const fn base(&self) -> &ReportBase {
        &self.base
    }
}

impl Default for OrderVolumeReport {
    fn default() -> Self {
        Self::new()
    }
}

impl ReportContract for OrderVolumeReport {
    fn slug(&self) -> &'static str {
        self.base.slug()
    }

    fn title(&self) -> &'static str {
        self.base.title()
    }

    fn rows(&self, data: &Dataset) -> Vec<ReportRow> {
        data.orders
            .iter()
            .map(|order| order.priority.label())
            .counts()
            .into_iter()
            .sorted_by_key(|(label, _)| *label)
            .map(|(label, count)| ReportRow::new(label, count as f64))
            .collect()
    }
}
