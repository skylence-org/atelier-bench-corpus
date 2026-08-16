//! Share of orders carrying more than one part line.

use crate::contracts::metric_contract::{MetricContract, MetricUnit};
use crate::dataset::Dataset;
use crate::support::abstract_metric::MetricBase;

/// Share of orders carrying more than one part line.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct UpsellRateMetric {
    base: MetricBase,
}

impl UpsellRateMetric {
    /// Registry key, unique across the lane.
    pub const KEY: &'static str = "upsell-rate";

    pub const fn new() -> Self {
        Self {
            base: MetricBase::new(Self::KEY, MetricUnit::Percent),
        }
    }

    pub const fn base(&self) -> &MetricBase {
        &self.base
    }
}

impl Default for UpsellRateMetric {
    fn default() -> Self {
        Self::new()
    }
}

impl MetricContract for UpsellRateMetric {
    fn key(&self) -> &'static str {
        self.base.key
    }

    fn unit(&self) -> MetricUnit {
        self.base.unit
    }

    fn compute(&self, data: &Dataset) -> f64 {
        let upsold = data
            .orders
            .iter()
            .filter(|order| order.parts.len() > 1)
            .count();

        upsold as f64 / data.orders.len().max(1) as f64
    }
}
