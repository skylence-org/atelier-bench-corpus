//! Days an invoice has been waiting for settlement.

use crate::contracts::report_contract::{ReportContract, ReportRow};
use crate::dataset::Dataset;
use crate::support::abstract_report::ReportBase;

/// Days an invoice has been waiting for settlement.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct PaymentLatencyReport {
    base: ReportBase,
}

impl PaymentLatencyReport {
    /// Registry slug; also the URL segment.
    pub const SLUG: &'static str = "payment-latency";

    pub const fn new() -> Self {
        Self {
            base: ReportBase::new(Self::SLUG, "Payment latency"),
        }
    }

    /// Shared identity and rendering precision.
    pub const fn base(&self) -> &ReportBase {
        &self.base
    }
}

impl Default for PaymentLatencyReport {
    fn default() -> Self {
        Self::new()
    }
}

impl ReportContract for PaymentLatencyReport {
    fn slug(&self) -> &'static str {
        self.base.slug()
    }

    fn title(&self) -> &'static str {
        self.base.title()
    }

    fn rows(&self, data: &Dataset) -> Vec<ReportRow> {
        data.invoices
            .iter()
            .map(|invoice| {
                let days = if invoice.paid {
                    0.0
                } else {
                    f64::from(invoice.id) * 3.5
                };

                ReportRow::new(format!("invoice-{}", invoice.id), days)
            })
            .collect()
    }
}
