//! Share of intake taken in under warranty.

use crate::contracts::metric_contract::{MetricContract, MetricUnit};
use crate::dataset::Dataset;
use crate::support::abstract_metric::MetricBase;
use atelier_core::support::priority::Priority;

/// Share of intake taken in under warranty.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct WarrantyRateMetric {
    base: MetricBase,
}

impl WarrantyRateMetric {
    /// Registry key, unique across the lane.
    pub const KEY: &'static str = "warranty-rate";

    pub const fn new() -> Self {
        Self {
            base: MetricBase::new(Self::KEY, MetricUnit::Percent),
        }
    }

    pub const fn base(&self) -> &MetricBase {
        &self.base
    }
}

impl Default for WarrantyRateMetric {
    fn default() -> Self {
        Self::new()
    }
}

impl MetricContract for WarrantyRateMetric {
    fn key(&self) -> &'static str {
        self.base.key
    }

    fn unit(&self) -> MetricUnit {
        self.base.unit
    }

    fn compute(&self, data: &Dataset) -> f64 {
        let warranty = data
            .orders
            .iter()
            .filter(|order| order.priority == Priority::Warranty)
            .count();

        warranty as f64 / data.orders.len().max(1) as f64
    }
}
