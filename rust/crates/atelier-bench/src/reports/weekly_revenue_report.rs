//! Invoiced revenue for the week to date.

use crate::contracts::report_contract::{ReportContract, ReportRow};
use crate::contracts::schedule_contract::{Cadence, ScheduleContract};
use crate::dataset::Dataset;
use crate::support::abstract_periodic_report::PeriodicReportBase;

/// Invoiced revenue for the week to date.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct WeeklyRevenueReport {
    base: PeriodicReportBase,
}

impl WeeklyRevenueReport {
    /// Registry slug; also the URL segment.
    pub const SLUG: &'static str = "weekly-revenue";

    pub const fn new() -> Self {
        Self {
            base: PeriodicReportBase::new(Self::SLUG, "Weekly revenue", Cadence::Weekly),
        }
    }

    /// Shared identity, precision and cadence.
    pub const fn base(&self) -> &PeriodicReportBase {
        &self.base
    }
}

impl Default for WeeklyRevenueReport {
    fn default() -> Self {
        Self::new()
    }
}

impl ScheduleContract for WeeklyRevenueReport {
    fn cadence(&self) -> Cadence {
        self.base.cadence
    }
}

impl ReportContract for WeeklyRevenueReport {
    fn slug(&self) -> &'static str {
        self.base.slug()
    }

    fn title(&self) -> &'static str {
        self.base.title()
    }

    fn rows(&self, data: &Dataset) -> Vec<ReportRow> {
        vec![ReportRow::from_cents("week to date", data.revenue_cents())]
    }
}
