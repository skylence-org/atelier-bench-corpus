//! Part cost absorbed by warranty work.

use crate::contracts::report_contract::{ReportContract, ReportRow};
use crate::dataset::Dataset;
use crate::support::abstract_report::ReportBase;
use atelier_core::support::priority::Priority;

/// Part cost absorbed by warranty work.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct WarrantyCostReport {
    base: ReportBase,
}

impl WarrantyCostReport {
    /// Registry slug; also the URL segment.
    pub const SLUG: &'static str = "warranty-cost";

    pub const fn new() -> Self {
        Self {
            base: ReportBase::new(Self::SLUG, "Warranty cost"),
        }
    }

    /// Shared identity and rendering precision.
    pub const fn base(&self) -> &ReportBase {
        &self.base
    }
}

impl Default for WarrantyCostReport {
    fn default() -> Self {
        Self::new()
    }
}

impl ReportContract for WarrantyCostReport {
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
            .map(|order| {
                ReportRow::from_cents(
                    format!("order-{}", order.id),
                    order.parts_subtotal().cents(),
                )
            })
            .collect()
    }
}
