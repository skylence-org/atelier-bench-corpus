//! Intake rate over a nominal seven-day week.

use crate::contracts::metric_contract::{MetricContract, MetricUnit};
use crate::dataset::Dataset;
use crate::support::abstract_metric::MetricBase;

/// Intake rate over a nominal seven-day week.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct OrdersPerDayMetric {
    base: MetricBase,
}

impl OrdersPerDayMetric {
    /// Registry key, unique across the lane.
    pub const KEY: &'static str = "orders-per-day";

    pub const fn new() -> Self {
        Self {
            base: MetricBase::new(Self::KEY, MetricUnit::Count),
        }
    }

    pub const fn base(&self) -> &MetricBase {
        &self.base
    }
}

impl Default for OrdersPerDayMetric {
    fn default() -> Self {
        Self::new()
    }
}

impl MetricContract for OrdersPerDayMetric {
    fn key(&self) -> &'static str {
        self.base.key
    }

    fn unit(&self) -> MetricUnit {
        self.base.unit
    }

    fn compute(&self, data: &Dataset) -> f64 {
        data.orders.len() as f64 / 7.0
    }
}
