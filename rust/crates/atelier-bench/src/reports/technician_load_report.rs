//! Booked share of each technician's day.

use crate::contracts::report_contract::{ReportContract, ReportRow};
use crate::dataset::Dataset;
use crate::support::abstract_report::ReportBase;

/// Booked share of each technician's day.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct TechnicianLoadReport {
    base: ReportBase,
}

impl TechnicianLoadReport {
    /// Registry slug; also the URL segment.
    pub const SLUG: &'static str = "technician-load";

    pub const fn new() -> Self {
        Self {
            base: ReportBase::new(Self::SLUG, "Technician load"),
        }
    }

    /// Shared identity and rendering precision.
    pub const fn base(&self) -> &ReportBase {
        &self.base
    }
}

impl Default for TechnicianLoadReport {
    fn default() -> Self {
        Self::new()
    }
}

impl ReportContract for TechnicianLoadReport {
    fn slug(&self) -> &'static str {
        self.base.slug()
    }

    fn title(&self) -> &'static str {
        self.base.title()
    }

    fn rows(&self, data: &Dataset) -> Vec<ReportRow> {
        data.technicians
            .iter()
            .map(|technician| ReportRow::new(technician.name.clone(), technician.utilisation()))
            .collect()
    }
}
