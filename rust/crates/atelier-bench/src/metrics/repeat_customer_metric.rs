//! Share of customers with more than one order.

use crate::contracts::metric_contract::{MetricContract, MetricUnit};
use crate::dataset::Dataset;
use crate::support::abstract_metric::MetricBase;

/// Share of customers with more than one order.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct RepeatCustomerMetric {
    base: MetricBase,
}

impl RepeatCustomerMetric {
    /// Registry key, unique across the lane.
    pub const KEY: &'static str = "repeat-customer";

    pub const fn new() -> Self {
        Self {
            base: MetricBase::new(Self::KEY, MetricUnit::Percent),
        }
    }

    pub const fn base(&self) -> &MetricBase {
        &self.base
    }
}

impl Default for RepeatCustomerMetric {
    fn default() -> Self {
        Self::new()
    }
}

impl MetricContract for RepeatCustomerMetric {
    fn key(&self) -> &'static str {
        self.base.key
    }

    fn unit(&self) -> MetricUnit {
        self.base.unit
    }

    fn compute(&self, data: &Dataset) -> f64 {
        if data.customers.is_empty() {
            return 0.0;
        }

        let repeat = data
            .customers
            .iter()
            .filter(|customer| data.orders_for(customer.id).len() > 1)
            .count();

        repeat as f64 / data.customers.len() as f64
    }
}
