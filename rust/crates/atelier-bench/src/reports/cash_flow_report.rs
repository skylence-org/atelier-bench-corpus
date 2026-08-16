//! Paid versus outstanding invoice cash.

use crate::contracts::cacheable_contract::CacheableContract;
use crate::contracts::composite_contract::CompositeContract;
use crate::contracts::report_contract::{ReportContract, ReportRow};
use crate::contracts::schedule_contract::{Cadence, ScheduleContract};
use crate::dataset::Dataset;
use crate::support::abstract_report::ReportBase;

/// Paid versus outstanding invoice cash.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct CashFlowReport {
    base: ReportBase,
}

impl CashFlowReport {
    /// Registry slug; also the URL segment.
    pub const SLUG: &'static str = "cash-flow";

    pub const fn new() -> Self {
        Self {
            base: ReportBase::new(Self::SLUG, "Cash flow"),
        }
    }

    /// Shared identity and rendering precision.
    pub const fn base(&self) -> &ReportBase {
        &self.base
    }
}

impl Default for CashFlowReport {
    fn default() -> Self {
        Self::new()
    }
}

impl ReportContract for CashFlowReport {
    fn slug(&self) -> &'static str {
        self.base.slug()
    }

    fn title(&self) -> &'static str {
        self.base.title()
    }

    fn rows(&self, data: &Dataset) -> Vec<ReportRow> {
        let paid: i64 = data
            .invoices
            .iter()
            .filter(|invoice| invoice.paid)
            .map(|invoice| invoice.total.cents())
            .sum();
        let outstanding: i64 = data
            .invoices
            .iter()
            .map(|invoice| invoice.outstanding().cents())
            .sum();

        vec![
            ReportRow::from_cents("paid", paid),
            ReportRow::from_cents("outstanding", outstanding),
        ]
    }
}

impl CacheableContract for CashFlowReport {
    fn cache_key(&self) -> String {
        format!("report:{}", self.slug())
    }
}

impl ScheduleContract for CashFlowReport {
    fn cadence(&self) -> Cadence {
        Cadence::Daily
    }
}

/// Sole [`CompositeContract`] implementor: reportable, cacheable and
/// schedulable all at once, without adding a 25th [`ReportContract`].
impl CompositeContract for CashFlowReport {}
