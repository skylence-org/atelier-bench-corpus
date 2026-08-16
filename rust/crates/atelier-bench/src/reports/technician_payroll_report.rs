//! Labour cost split evenly across the bench.

use crate::contracts::report_contract::{ReportContract, ReportRow};
use crate::dataset::Dataset;
use crate::support::abstract_report::ReportBase;

/// Labour cost split evenly across the bench.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct TechnicianPayrollReport {
    base: ReportBase,
}

impl TechnicianPayrollReport {
    /// Registry slug; also the URL segment.
    pub const SLUG: &'static str = "technician-payroll";

    pub const fn new() -> Self {
        Self {
            base: ReportBase::new(Self::SLUG, "Technician payroll"),
        }
    }

    /// Shared identity and rendering precision.
    pub const fn base(&self) -> &ReportBase {
        &self.base
    }
}

impl Default for TechnicianPayrollReport {
    fn default() -> Self {
        Self::new()
    }
}

impl ReportContract for TechnicianPayrollReport {
    fn slug(&self) -> &'static str {
        self.base.slug()
    }

    fn title(&self) -> &'static str {
        self.base.title()
    }

    fn rows(&self, data: &Dataset) -> Vec<ReportRow> {
        let minutes = f64::from(data.labour_minutes());
        let head_count = data.technicians.len().max(1) as f64;
        let share = (minutes / head_count * 125.0) as i64;

        data.technicians
            .iter()
            .map(|technician| ReportRow::from_cents(technician.name.clone(), share))
            .collect()
    }
}
