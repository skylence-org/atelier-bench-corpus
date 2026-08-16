//! Stand-in satisfaction score derived from the customer count.

use crate::contracts::metric_contract::{MetricContract, MetricUnit};
use crate::dataset::Dataset;
use crate::support::abstract_metric::MetricBase;

/// Stand-in satisfaction score derived from the customer count.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct NpsMetric {
    base: MetricBase,
}

impl NpsMetric {
    /// Registry key, unique across the lane.
    pub const KEY: &'static str = "nps";

    pub const fn new() -> Self {
        Self {
            base: MetricBase::new(Self::KEY, MetricUnit::Count),
        }
    }

    pub const fn base(&self) -> &MetricBase {
        &self.base
    }
}

impl Default for NpsMetric {
    fn default() -> Self {
        Self::new()
    }
}

impl MetricContract for NpsMetric {
    fn key(&self) -> &'static str {
        self.base.key
    }

    fn unit(&self) -> MetricUnit {
        self.base.unit
    }

    fn compute(&self, data: &Dataset) -> f64 {
        data.customers.len() as f64 * 8.5
    }
}
