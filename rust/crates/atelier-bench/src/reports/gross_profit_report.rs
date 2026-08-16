//! Invoiced revenue minus consumed part cost.

use crate::contracts::report_contract::{ReportContract, ReportRow};
use crate::dataset::Dataset;
use crate::support::abstract_report::ReportBase;

/// Invoiced revenue minus consumed part cost.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct GrossProfitReport {
    base: ReportBase,
}

impl GrossProfitReport {
    /// Registry slug; also the URL segment.
    pub const SLUG: &'static str = "gross-profit";

    pub const fn new() -> Self {
        Self {
            base: ReportBase::new(Self::SLUG, "Gross profit"),
        }
    }

    /// Shared identity and rendering precision.
    pub const fn base(&self) -> &ReportBase {
        &self.base
    }
}

impl Default for GrossProfitReport {
    fn default() -> Self {
        Self::new()
    }
}

impl ReportContract for GrossProfitReport {
    fn slug(&self) -> &'static str {
        self.base.slug()
    }

    fn title(&self) -> &'static str {
        self.base.title()
    }

    fn rows(&self, data: &Dataset) -> Vec<ReportRow> {
        let revenue = data.revenue_cents();
        let cost = data.parts_cost_cents();

        vec![
            ReportRow::from_cents("revenue", revenue),
            ReportRow::from_cents("part cost", cost),
            ReportRow::from_cents("gross profit", revenue - cost),
        ]
    }
}
