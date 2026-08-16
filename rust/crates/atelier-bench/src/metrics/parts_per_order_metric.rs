//! Mean number of part lines per order.

use crate::contracts::metric_contract::{MetricContract, MetricUnit};
use crate::dataset::Dataset;
use crate::support::abstract_metric::MetricBase;

/// Mean number of part lines per order.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct PartsPerOrderMetric {
    base: MetricBase,
}

impl PartsPerOrderMetric {
    /// Registry key, unique across the lane.
    pub const KEY: &'static str = "parts-per-order";

    pub const fn new() -> Self {
        Self {
            base: MetricBase::new(Self::KEY, MetricUnit::Count),
        }
    }

    pub const fn base(&self) -> &MetricBase {
        &self.base
    }
}

impl Default for PartsPerOrderMetric {
    fn default() -> Self {
        Self::new()
    }
}

impl MetricContract for PartsPerOrderMetric {
    fn key(&self) -> &'static str {
        self.base.key
    }

    fn unit(&self) -> MetricUnit {
        self.base.unit
    }

    fn compute(&self, data: &Dataset) -> f64 {
        let lines: usize = data.orders.iter().map(|order| order.parts.len()).sum();

        lines as f64 / data.orders.len().max(1) as f64
    }
}
