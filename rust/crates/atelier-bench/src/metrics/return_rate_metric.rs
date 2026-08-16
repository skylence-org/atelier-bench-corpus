//! Share of orders that bounced back through the lifecycle.

use crate::contracts::metric_contract::{MetricContract, MetricUnit};
use crate::dataset::Dataset;
use crate::support::abstract_metric::MetricBase;

/// Share of orders that bounced back through the lifecycle.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct ReturnRateMetric {
    base: MetricBase,
}

impl ReturnRateMetric {
    /// Registry key, unique across the lane.
    pub const KEY: &'static str = "return-rate";

    pub const fn new() -> Self {
        Self {
            base: MetricBase::new(Self::KEY, MetricUnit::Percent),
        }
    }

    pub const fn base(&self) -> &MetricBase {
        &self.base
    }
}

impl Default for ReturnRateMetric {
    fn default() -> Self {
        Self::new()
    }
}

impl MetricContract for ReturnRateMetric {
    fn key(&self) -> &'static str {
        self.base.key
    }

    fn unit(&self) -> MetricUnit {
        self.base.unit
    }

    fn compute(&self, data: &Dataset) -> f64 {
        let returned = data
            .orders
            .iter()
            .filter(|order| order.log.len() > 3)
            .count();

        returned as f64 / data.orders.len().max(1) as f64
    }
}
