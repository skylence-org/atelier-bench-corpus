//! Fixed overhead charged as a share of part cost.

use crate::contracts::metric_contract::{MetricContract, MetricUnit};
use crate::dataset::Dataset;
use crate::support::abstract_metric::MetricBase;

/// Fixed overhead charged as a share of part cost.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct OverheadMetric {
    base: MetricBase,
}

impl OverheadMetric {
    /// Registry key, unique across the lane.
    pub const KEY: &'static str = "overhead";

    pub const fn new() -> Self {
        Self {
            base: MetricBase::new(Self::KEY, MetricUnit::Cents),
        }
    }

    pub const fn base(&self) -> &MetricBase {
        &self.base
    }
}

impl Default for OverheadMetric {
    fn default() -> Self {
        Self::new()
    }
}

impl MetricContract for OverheadMetric {
    fn key(&self) -> &'static str {
        self.base.key
    }

    fn unit(&self) -> MetricUnit {
        self.base.unit
    }

    fn compute(&self, data: &Dataset) -> f64 {
        data.parts_cost_cents() as f64 * 0.15
    }
}
