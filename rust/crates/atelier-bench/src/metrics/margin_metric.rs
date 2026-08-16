//! Revenue left after part cost.

use crate::contracts::metric_contract::{MetricContract, MetricUnit};
use crate::dataset::Dataset;
use crate::support::abstract_metric::MetricBase;

/// Revenue left after part cost.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct MarginMetric {
    base: MetricBase,
}

impl MarginMetric {
    /// Registry key, unique across the lane.
    pub const KEY: &'static str = "margin";

    pub const fn new() -> Self {
        Self {
            base: MetricBase::new(Self::KEY, MetricUnit::Percent),
        }
    }

    pub const fn base(&self) -> &MetricBase {
        &self.base
    }
}

impl Default for MarginMetric {
    fn default() -> Self {
        Self::new()
    }
}

impl MetricContract for MarginMetric {
    fn key(&self) -> &'static str {
        self.base.key
    }

    fn unit(&self) -> MetricUnit {
        self.base.unit
    }

    fn compute(&self, data: &Dataset) -> f64 {
        let revenue = data.revenue_cents() as f64;
        if revenue == 0.0 {
            return 0.0;
        }

        (revenue - data.parts_cost_cents() as f64) / revenue
    }
}
