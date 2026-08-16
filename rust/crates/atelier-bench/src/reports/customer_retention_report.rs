//! Customers who came back at least once.

use crate::contracts::report_contract::{ReportContract, ReportRow};
use crate::dataset::Dataset;
use crate::support::abstract_report::ReportBase;

/// Customers who came back at least once.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct CustomerRetentionReport {
    base: ReportBase,
}

impl CustomerRetentionReport {
    /// Registry slug; also the URL segment.
    pub const SLUG: &'static str = "customer-retention";

    pub const fn new() -> Self {
        Self {
            base: ReportBase::new(Self::SLUG, "Customer retention"),
        }
    }

    /// Shared identity and rendering precision.
    pub const fn base(&self) -> &ReportBase {
        &self.base
    }
}

impl Default for CustomerRetentionReport {
    fn default() -> Self {
        Self::new()
    }
}

impl ReportContract for CustomerRetentionReport {
    fn slug(&self) -> &'static str {
        self.base.slug()
    }

    fn title(&self) -> &'static str {
        self.base.title()
    }

    fn rows(&self, data: &Dataset) -> Vec<ReportRow> {
        data.customers
            .iter()
            .map(|customer| {
                ReportRow::new(
                    customer.name.clone(),
                    data.orders_for(customer.id).len() as f64,
                )
            })
            .filter(|row| row.value > 1.0)
            .collect()
    }
}
