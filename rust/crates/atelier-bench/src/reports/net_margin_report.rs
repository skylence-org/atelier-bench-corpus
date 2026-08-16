//! Revenue less part cost, as a share of revenue.

use crate::contracts::report_contract::{ReportContract, ReportRow};
use crate::dataset::Dataset;
use crate::support::abstract_report::ReportBase;

/// Revenue less part cost, as a share of revenue.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct NetMarginReport {
    base: ReportBase,
}

impl NetMarginReport {
    /// Registry slug; also the URL segment.
    pub const SLUG: &'static str = "net-margin";

    pub const fn new() -> Self {
        Self {
            base: ReportBase::new(Self::SLUG, "Net margin"),
        }
    }

    /// Shared identity and rendering precision.
    pub const fn base(&self) -> &ReportBase {
        &self.base
    }
}

impl Default for NetMarginReport {
    fn default() -> Self {
        Self::new()
    }
}

impl ReportContract for NetMarginReport {
    fn slug(&self) -> &'static str {
        self.base.slug()
    }

    fn title(&self) -> &'static str {
        self.base.title()
    }

    fn rows(&self, data: &Dataset) -> Vec<ReportRow> {
        let revenue = data.revenue_cents() as f64;
        let cost = data.parts_cost_cents() as f64;
        let margin = if revenue == 0.0 {
            0.0
        } else {
            (revenue - cost) / revenue
        };

        vec![ReportRow::new("net margin", margin)]
    }
}
