//! Mean shelf depth, used as an age proxy.

use crate::contracts::metric_contract::{MetricContract, MetricUnit};
use crate::dataset::Dataset;
use crate::support::abstract_metric::MetricBase;

/// Mean shelf depth, used as an age proxy.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct InventoryAgeMetric {
    base: MetricBase,
}

impl InventoryAgeMetric {
    /// Registry key, unique across the lane.
    pub const KEY: &'static str = "inventory-age";

    pub const fn new() -> Self {
        Self {
            base: MetricBase::new(Self::KEY, MetricUnit::Days),
        }
    }

    pub const fn base(&self) -> &MetricBase {
        &self.base
    }
}

impl Default for InventoryAgeMetric {
    fn default() -> Self {
        Self::new()
    }
}

impl MetricContract for InventoryAgeMetric {
    fn key(&self) -> &'static str {
        self.base.key
    }

    fn unit(&self) -> MetricUnit {
        self.base.unit
    }

    fn compute(&self, data: &Dataset) -> f64 {
        let stock: f64 = data.parts.iter().map(|part| f64::from(part.stock)).sum();

        stock / data.parts.len().max(1) as f64
    }
}
