//! Mean invoiced value per order.

use crate::contracts::metric_contract::{MetricContract, MetricUnit};
use crate::dataset::Dataset;
use crate::support::abstract_metric::MetricBase;

/// Mean invoiced value per order.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct AverageTicketMetric {
    base: MetricBase,
}

impl AverageTicketMetric {
    /// Registry key, unique across the lane.
    pub const KEY: &'static str = "average-ticket";

    pub const fn new() -> Self {
        Self {
            base: MetricBase::new(Self::KEY, MetricUnit::Cents),
        }
    }

    pub const fn base(&self) -> &MetricBase {
        &self.base
    }
}

impl Default for AverageTicketMetric {
    fn default() -> Self {
        Self::new()
    }
}

impl MetricContract for AverageTicketMetric {
    fn key(&self) -> &'static str {
        self.base.key
    }

    fn unit(&self) -> MetricUnit {
        self.base.unit
    }

    fn compute(&self, data: &Dataset) -> f64 {
        if data.orders.is_empty() {
            return 0.0;
        }

        data.revenue_cents() as f64 / data.orders.len() as f64
    }
}
