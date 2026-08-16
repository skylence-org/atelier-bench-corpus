//! Part revenue of every order that reached a billable state.

use crate::contracts::report_contract::{ReportContract, ReportRow};
use crate::contracts::schedule_contract::{Cadence, ScheduleContract};
use crate::dataset::Dataset;
use crate::support::abstract_periodic_report::PeriodicReportBase;

/// Part revenue of every order that reached a billable state.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct DailyRevenueReport {
    base: PeriodicReportBase,
}

impl DailyRevenueReport {
    /// Registry slug; also the URL segment.
    pub const SLUG: &'static str = "daily-revenue";

    pub const fn new() -> Self {
        Self {
            base: PeriodicReportBase::new(Self::SLUG, "Daily revenue", Cadence::Daily),
        }
    }

    /// Shared identity, precision and cadence.
    pub const fn base(&self) -> &PeriodicReportBase {
        &self.base
    }
}

impl Default for DailyRevenueReport {
    fn default() -> Self {
        Self::new()
    }
}

impl ScheduleContract for DailyRevenueReport {
    fn cadence(&self) -> Cadence {
        self.base.cadence
    }
}

impl ReportContract for DailyRevenueReport {
    fn slug(&self) -> &'static str {
        self.base.slug()
    }

    fn title(&self) -> &'static str {
        self.base.title()
    }

    fn rows(&self, data: &Dataset) -> Vec<ReportRow> {
        data.completed_orders()
            .iter()
            .map(|order| {
                ReportRow::from_cents(
                    format!("order-{}", order.id),
                    order.parts_subtotal().cents(),
                )
            })
            .collect()
    }
}
