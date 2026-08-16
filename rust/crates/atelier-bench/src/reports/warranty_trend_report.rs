//! Warranty share of total intake.

use crate::contracts::report_contract::{ReportContract, ReportRow};
use crate::dataset::Dataset;
use crate::support::abstract_report::ReportBase;
use atelier_core::support::priority::Priority;

/// Warranty share of total intake.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct WarrantyTrendReport {
    base: ReportBase,
}

impl WarrantyTrendReport {
    /// Registry slug; also the URL segment.
    pub const SLUG: &'static str = "warranty-trend";

    pub const fn new() -> Self {
        Self {
            base: ReportBase::new(Self::SLUG, "Warranty trend"),
        }
    }

    /// Shared identity and rendering precision.
    pub const fn base(&self) -> &ReportBase {
        &self.base
    }
}

impl Default for WarrantyTrendReport {
    fn default() -> Self {
        Self::new()
    }
}

impl ReportContract for WarrantyTrendReport {
    fn slug(&self) -> &'static str {
        self.base.slug()
    }

    fn title(&self) -> &'static str {
        self.base.title()
    }

    fn rows(&self, data: &Dataset) -> Vec<ReportRow> {
        let warranty = data
            .orders
            .iter()
            .filter(|order| order.priority == Priority::Warranty)
            .count();
        let ratio = if data.orders.is_empty() {
            0.0
        } else {
            warranty as f64 / data.orders.len() as f64
        };

        vec![ReportRow::new("warranty share", ratio)]
    }
}
