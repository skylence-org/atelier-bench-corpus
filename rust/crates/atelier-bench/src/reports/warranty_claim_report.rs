//! Orders taken in under warranty.

use crate::contracts::report_contract::{ReportContract, ReportRow};
use crate::dataset::Dataset;
use crate::support::abstract_report::ReportBase;
use atelier_core::support::priority::Priority;

/// Orders taken in under warranty.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct WarrantyClaimReport {
    base: ReportBase,
}

impl WarrantyClaimReport {
    /// Registry slug; also the URL segment.
    pub const SLUG: &'static str = "warranty-claim";

    pub const fn new() -> Self {
        Self {
            base: ReportBase::new(Self::SLUG, "Warranty claims"),
        }
    }

    /// Shared identity and rendering precision.
    pub const fn base(&self) -> &ReportBase {
        &self.base
    }
}

impl Default for WarrantyClaimReport {
    fn default() -> Self {
        Self::new()
    }
}

impl ReportContract for WarrantyClaimReport {
    fn slug(&self) -> &'static str {
        self.base.slug()
    }

    fn title(&self) -> &'static str {
        self.base.title()
    }

    fn rows(&self, data: &Dataset) -> Vec<ReportRow> {
        data.orders
            .iter()
            .filter(|order| order.priority == Priority::Warranty)
            .map(|order| ReportRow::new(format!("order-{}", order.id), 1.0))
            .collect()
    }
}
