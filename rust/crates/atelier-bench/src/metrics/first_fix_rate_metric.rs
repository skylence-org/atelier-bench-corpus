//! Share of orders closed without a parts detour.

use crate::contracts::metric_contract::{MetricContract, MetricUnit};
use crate::dataset::Dataset;
use crate::support::abstract_metric::MetricBase;

/// Share of orders closed without a parts detour.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct FirstFixRateMetric {
    base: MetricBase,
}

impl FirstFixRateMetric {
    /// Registry key, unique across the lane.
    pub const KEY: &'static str = "first-fix-rate";

    pub const fn new() -> Self {
        Self {
            base: MetricBase::new(Self::KEY, MetricUnit::Percent),
        }
    }

    pub const fn base(&self) -> &MetricBase {
        &self.base
    }
}

impl Default for FirstFixRateMetric {
    fn default() -> Self {
        Self::new()
    }
}

impl MetricContract for FirstFixRateMetric {
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

        let clean = data
            .orders
            .iter()
            .filter(|order| order.log.len() <= 3)
            .count();

        clean as f64 / data.orders.len() as f64
    }
}
