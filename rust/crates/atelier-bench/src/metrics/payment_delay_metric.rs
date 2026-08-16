//! Mean age of the unsettled invoice pile.

use crate::contracts::metric_contract::{MetricContract, MetricUnit};
use crate::dataset::Dataset;
use crate::support::abstract_metric::MetricBase;

/// Mean age of the unsettled invoice pile.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct PaymentDelayMetric {
    base: MetricBase,
}

impl PaymentDelayMetric {
    /// Registry key, unique across the lane.
    pub const KEY: &'static str = "payment-delay";

    pub const fn new() -> Self {
        Self {
            base: MetricBase::new(Self::KEY, MetricUnit::Days),
        }
    }

    pub const fn base(&self) -> &MetricBase {
        &self.base
    }
}

impl Default for PaymentDelayMetric {
    fn default() -> Self {
        Self::new()
    }
}

impl MetricContract for PaymentDelayMetric {
    fn key(&self) -> &'static str {
        self.base.key
    }

    fn unit(&self) -> MetricUnit {
        self.base.unit
    }

    fn compute(&self, data: &Dataset) -> f64 {
        data.invoices.iter().filter(|invoice| !invoice.paid).count() as f64 * 3.5
    }
}
