//! Total part cost across every order.

use crate::contracts::metric_contract::{MetricContract, MetricUnit};
use crate::dataset::Dataset;
use crate::support::abstract_metric::MetricBase;

/// Total part cost across every order.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct PartCostMetric {
    base: MetricBase,
}

impl PartCostMetric {
    /// Registry key, unique across the lane.
    pub const KEY: &'static str = "part-cost";

    pub const fn new() -> Self {
        Self {
            base: MetricBase::new(Self::KEY, MetricUnit::Cents),
        }
    }

    pub const fn base(&self) -> &MetricBase {
        &self.base
    }
}

impl Default for PartCostMetric {
    fn default() -> Self {
        Self::new()
    }
}

impl MetricContract for PartCostMetric {
    fn key(&self) -> &'static str {
        self.base.key
    }

    fn unit(&self) -> MetricUnit {
        self.base.unit
    }

    fn compute(&self, data: &Dataset) -> f64 {
        data.parts_cost_cents() as f64
    }
}
