//! Part spend per customer across every order.

use crate::contracts::report_contract::{ReportContract, ReportRow};
use crate::dataset::Dataset;
use crate::support::abstract_report::ReportBase;

/// Part spend per customer across every order.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct CustomerLifetimeReport {
    base: ReportBase,
}

impl CustomerLifetimeReport {
    /// Registry slug; also the URL segment.
    pub const SLUG: &'static str = "customer-lifetime";

    pub const fn new() -> Self {
        Self {
            base: ReportBase::new(Self::SLUG, "Customer lifetime value"),
        }
    }

    /// Shared identity and rendering precision.
    pub const fn base(&self) -> &ReportBase {
        &self.base
    }
}

impl Default for CustomerLifetimeReport {
    fn default() -> Self {
        Self::new()
    }
}

impl ReportContract for CustomerLifetimeReport {
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
                let cents: i64 = data
                    .orders_for(customer.id)
                    .iter()
                    .map(|order| order.parts_subtotal().cents())
                    .sum();

                ReportRow::from_cents(customer.name.clone(), cents)
            })
            .collect()
    }
}
