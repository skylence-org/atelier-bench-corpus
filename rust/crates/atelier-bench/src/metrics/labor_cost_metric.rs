//! Total labour cost at the standard rate.

use crate::contracts::metric_contract::{MetricContract, MetricUnit};
use crate::dataset::Dataset;
use crate::support::abstract_metric::MetricBase;

/// Total labour cost at the standard rate.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct LaborCostMetric {
    base: MetricBase,
}

impl LaborCostMetric {
    /// Registry key, unique across the lane.
    pub const KEY: &'static str = "labor-cost";

    pub const fn new() -> Self {
        Self {
            base: MetricBase::new(Self::KEY, MetricUnit::Cents),
        }
    }

    pub const fn base(&self) -> &MetricBase {
        &self.base
    }
}

impl Default for LaborCostMetric {
    fn default() -> Self {
        Self::new()
    }
}

impl MetricContract for LaborCostMetric {
    fn key(&self) -> &'static str {
        self.base.key
    }

    fn unit(&self) -> MetricUnit {
        self.base.unit
    }

    fn compute(&self, data: &Dataset) -> f64 {
        f64::from(data.labour_minutes()) * 125.0
    }
}
