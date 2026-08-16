//! Invoiced revenue for the month to date.

use crate::contracts::report_contract::{ReportContract, ReportRow};
use crate::contracts::schedule_contract::{Cadence, ScheduleContract};
use crate::dataset::Dataset;
use crate::support::abstract_periodic_report::PeriodicReportBase;

/// Invoiced revenue for the month to date.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct MonthlyRevenueReport {
    base: PeriodicReportBase,
}

impl MonthlyRevenueReport {
    /// Registry slug; also the URL segment.
    pub const SLUG: &'static str = "monthly-revenue";

    pub const fn new() -> Self {
        Self {
            base: PeriodicReportBase::new(Self::SLUG, "Monthly revenue", Cadence::Monthly),
        }
    }

    /// Shared identity, precision and cadence.
    pub const fn base(&self) -> &PeriodicReportBase {
        &self.base
    }
}

impl Default for MonthlyRevenueReport {
    fn default() -> Self {
        Self::new()
    }
}

impl ScheduleContract for MonthlyRevenueReport {
    fn cadence(&self) -> Cadence {
        self.base.cadence
    }
}

impl ReportContract for MonthlyRevenueReport {
    fn slug(&self) -> &'static str {
        self.base.slug()
    }

    fn title(&self) -> &'static str {
        self.base.title()
    }

    fn rows(&self, data: &Dataset) -> Vec<ReportRow> {
        vec![ReportRow::from_cents("month to date", data.revenue_cents())]
    }
}
