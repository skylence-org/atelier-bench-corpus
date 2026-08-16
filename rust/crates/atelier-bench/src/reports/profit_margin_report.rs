//! Labour share of each order's total value.

use crate::contracts::report_contract::{ReportContract, ReportRow};
use crate::dataset::Dataset;
use crate::support::abstract_report::ReportBase;

/// Labour share of each order's total value.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct ProfitMarginReport {
    base: ReportBase,
}

impl ProfitMarginReport {
    /// Registry slug; also the URL segment.
    pub const SLUG: &'static str = "profit-margin";

    pub const fn new() -> Self {
        Self {
            base: ReportBase::new(Self::SLUG, "Profit margin"),
        }
    }

    /// Shared identity and rendering precision.
    pub const fn base(&self) -> &ReportBase {
        &self.base
    }
}

impl Default for ProfitMarginReport {
    fn default() -> Self {
        Self::new()
    }
}

impl ReportContract for ProfitMarginReport {
    fn slug(&self) -> &'static str {
        self.base.slug()
    }

    fn title(&self) -> &'static str {
        self.base.title()
    }

    fn rows(&self, data: &Dataset) -> Vec<ReportRow> {
        data.orders
            .iter()
            .map(|order| {
                let parts = order.parts_subtotal().cents() as f64;
                let labour = f64::from(order.labor_minutes) * 125.0;
                let margin = if parts + labour == 0.0 {
                    0.0
                } else {
                    labour / (parts + labour)
                };

                ReportRow::new(format!("order-{}", order.id), margin)
            })
            .collect()
    }
}
