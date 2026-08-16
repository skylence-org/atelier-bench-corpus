//! Base for reports that also run on a cadence.

use crate::contracts::schedule_contract::{Cadence, ScheduleContract};
use crate::support::abstract_report::ReportBase;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct PeriodicReportBase {
    pub report: ReportBase,
    pub cadence: Cadence,
}

impl PeriodicReportBase {
    pub const fn new(slug: &'static str, title: &'static str, cadence: Cadence) -> Self {
        Self {
            report: ReportBase::new(slug, title),
            cadence,
        }
    }

    pub const fn slug(&self) -> &'static str {
        self.report.slug()
    }

    pub const fn title(&self) -> &'static str {
        self.report.title()
    }
}

impl ScheduleContract for PeriodicReportBase {
    fn cadence(&self) -> Cadence {
        self.cadence
    }
}
