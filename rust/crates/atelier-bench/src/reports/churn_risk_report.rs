//! Customers with nothing currently on the bench.

use crate::contracts::report_contract::{ReportContract, ReportRow};
use crate::dataset::Dataset;
use crate::support::abstract_report::ReportBase;

/// Customers with nothing currently on the bench.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct ChurnRiskReport {
    base: ReportBase,
}

impl ChurnRiskReport {
    /// Registry slug; also the URL segment.
    pub const SLUG: &'static str = "churn-risk";

    pub const fn new() -> Self {
        Self {
            base: ReportBase::new(Self::SLUG, "Churn risk"),
        }
    }

    /// Shared identity and rendering precision.
    pub const fn base(&self) -> &ReportBase {
        &self.base
    }
}

impl Default for ChurnRiskReport {
    fn default() -> Self {
        Self::new()
    }
}

impl ReportContract for ChurnRiskReport {
    fn slug(&self) -> &'static str {
        self.base.slug()
    }

    fn title(&self) -> &'static str {
        self.base.title()
    }

    fn rows(&self, data: &Dataset) -> Vec<ReportRow> {
        data.customers
            .iter()
            .filter(|customer| {
                data.orders_for(customer.id)
                    .iter()
                    .all(|order| !order.is_open())
            })
            .map(|customer| ReportRow::new(customer.name.clone(), 1.0))
            .collect()
    }
}
