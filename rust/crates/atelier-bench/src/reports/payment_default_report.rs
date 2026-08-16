//! Invoices still carrying an outstanding balance.

use crate::contracts::report_contract::{ReportContract, ReportRow};
use crate::dataset::Dataset;
use crate::support::abstract_report::ReportBase;

/// Invoices still carrying an outstanding balance.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct PaymentDefaultReport {
    base: ReportBase,
}

impl PaymentDefaultReport {
    /// Registry slug; also the URL segment.
    pub const SLUG: &'static str = "payment-default";

    pub const fn new() -> Self {
        Self {
            base: ReportBase::new(Self::SLUG, "Payment default"),
        }
    }

    /// Shared identity and rendering precision.
    pub const fn base(&self) -> &ReportBase {
        &self.base
    }
}

impl Default for PaymentDefaultReport {
    fn default() -> Self {
        Self::new()
    }
}

impl ReportContract for PaymentDefaultReport {
    fn slug(&self) -> &'static str {
        self.base.slug()
    }

    fn title(&self) -> &'static str {
        self.base.title()
    }

    fn rows(&self, data: &Dataset) -> Vec<ReportRow> {
        data.invoices
            .iter()
            .filter(|invoice| !invoice.paid)
            .map(|invoice| {
                ReportRow::from_cents(
                    format!("invoice-{}", invoice.id),
                    invoice.outstanding().cents(),
                )
            })
            .collect()
    }
}
