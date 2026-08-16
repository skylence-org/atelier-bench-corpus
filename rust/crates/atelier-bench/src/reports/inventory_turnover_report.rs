//! Consumed units against units still on the shelf.

use crate::contracts::report_contract::{ReportContract, ReportRow};
use crate::dataset::Dataset;
use crate::support::abstract_report::ReportBase;

/// Consumed units against units still on the shelf.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct InventoryTurnoverReport {
    base: ReportBase,
}

impl InventoryTurnoverReport {
    /// Registry slug; also the URL segment.
    pub const SLUG: &'static str = "inventory-turnover";

    pub const fn new() -> Self {
        Self {
            base: ReportBase::new(Self::SLUG, "Inventory turnover"),
        }
    }

    /// Shared identity and rendering precision.
    pub const fn base(&self) -> &ReportBase {
        &self.base
    }
}

impl Default for InventoryTurnoverReport {
    fn default() -> Self {
        Self::new()
    }
}

impl ReportContract for InventoryTurnoverReport {
    fn slug(&self) -> &'static str {
        self.base.slug()
    }

    fn title(&self) -> &'static str {
        self.base.title()
    }

    fn rows(&self, data: &Dataset) -> Vec<ReportRow> {
        data.parts
            .iter()
            .map(|part| {
                let turnover = if part.stock == 0 {
                    0.0
                } else {
                    f64::from(part.consumed_quantity()) / f64::from(part.stock)
                };

                ReportRow::new(part.sku.clone(), turnover)
            })
            .collect()
    }
}
