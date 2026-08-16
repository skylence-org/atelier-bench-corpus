//! Head-room left on each technician's day.

use crate::contracts::report_contract::{ReportContract, ReportRow};
use crate::dataset::Dataset;
use crate::support::abstract_report::ReportBase;

/// Head-room left on each technician's day.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct TechnicianEfficiencyReport {
    base: ReportBase,
}

impl TechnicianEfficiencyReport {
    /// Registry slug; also the URL segment.
    pub const SLUG: &'static str = "technician-efficiency";

    pub const fn new() -> Self {
        Self {
            base: ReportBase::new(Self::SLUG, "Technician efficiency"),
        }
    }

    /// Shared identity and rendering precision.
    pub const fn base(&self) -> &ReportBase {
        &self.base
    }
}

impl Default for TechnicianEfficiencyReport {
    fn default() -> Self {
        Self::new()
    }
}

impl ReportContract for TechnicianEfficiencyReport {
    fn slug(&self) -> &'static str {
        self.base.slug()
    }

    fn title(&self) -> &'static str {
        self.base.title()
    }

    fn rows(&self, data: &Dataset) -> Vec<ReportRow> {
        data.technicians
            .iter()
            .map(|technician| {
                ReportRow::new(technician.name.clone(), 1.0 - technician.utilisation())
            })
            .collect()
    }
}
