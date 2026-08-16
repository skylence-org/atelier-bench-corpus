//! Units consumed per part since the last count.

use crate::contracts::report_contract::{ReportContract, ReportRow};
use crate::dataset::Dataset;
use crate::support::abstract_report::ReportBase;

/// Units consumed per part since the last count.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct PartUsageReport {
    base: ReportBase,
}

impl PartUsageReport {
    /// Registry slug; also the URL segment.
    pub const SLUG: &'static str = "part-usage";

    pub const fn new() -> Self {
        Self {
            base: ReportBase::new(Self::SLUG, "Part usage"),
        }
    }

    /// Shared identity and rendering precision.
    pub const fn base(&self) -> &ReportBase {
        &self.base
    }
}

impl Default for PartUsageReport {
    fn default() -> Self {
        Self::new()
    }
}

impl ReportContract for PartUsageReport {
    fn slug(&self) -> &'static str {
        self.base.slug()
    }

    fn title(&self) -> &'static str {
        self.base.title()
    }

    fn rows(&self, data: &Dataset) -> Vec<ReportRow> {
        data.parts
            .iter()
            .map(|part| ReportRow::new(part.name.clone(), f64::from(part.consumed_quantity())))
            .collect()
    }
}
