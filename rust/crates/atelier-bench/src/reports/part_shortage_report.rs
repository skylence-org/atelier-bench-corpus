//! Parts at or below their reorder level.

use crate::contracts::report_contract::{ReportContract, ReportRow};
use crate::dataset::Dataset;
use crate::support::abstract_report::ReportBase;

/// Parts at or below their reorder level.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct PartShortageReport {
    base: ReportBase,
}

impl PartShortageReport {
    /// Registry slug; also the URL segment.
    pub const SLUG: &'static str = "part-shortage";

    pub const fn new() -> Self {
        Self {
            base: ReportBase::new(Self::SLUG, "Part shortage"),
        }
    }

    /// Shared identity and rendering precision.
    pub const fn base(&self) -> &ReportBase {
        &self.base
    }
}

impl Default for PartShortageReport {
    fn default() -> Self {
        Self::new()
    }
}

impl ReportContract for PartShortageReport {
    fn slug(&self) -> &'static str {
        self.base.slug()
    }

    fn title(&self) -> &'static str {
        self.base.title()
    }

    fn rows(&self, data: &Dataset) -> Vec<ReportRow> {
        data.low_stock_parts()
            .iter()
            .map(|part| ReportRow::new(part.sku.clone(), f64::from(part.stock)))
            .collect()
    }
}
